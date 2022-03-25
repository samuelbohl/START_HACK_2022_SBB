const fs = require("fs");
const csv = require("csv-parse/lib/sync");
const { start } = require("repl");
const skmeans = require('skmeans');

const time_metric = require('./metrics/time');
const holiday_metric = require('./metrics/holiday');
const weather_metric = require('./metrics/weather');

var stations = {}; // map abbreviation to OPUIC
var trains = {}; // contains all stops and departure/arrival times relative to start of day

// import station data
const stations_csv = fs.readFileSync(__dirname + '/data/dienststellen-gemass-opentransportdataswiss.csv');
const stations_records = csv.parse(stations_csv, { delimiter: ';', columns: true, skip_empty_lines: true });
stations_records.forEach(element => {
    const abbr = element['Station abbreviation'];
    if (abbr != '') stations[abbr] = element['OPUIC'];
});

// import train data
const trains_csv = fs.readFileSync(__dirname + '/data/ist-daten-sbb.csv');
const trains_records = csv.parse(trains_csv, { delimiter: ';', columns: true, skip_empty_lines: true });
trains_records.forEach(element => {
    const train_id = parseInt(element['Linie']);
    const opuic = element['OPUIC'];
    let timestring = element['Arrival time'].length ? element['Arrival time'] : element['Departure time'];
    let time = Date.parse(timestring);
    time -= Date.parse(element['Day of operation']);
    if (trains[train_id] == undefined) trains[train_id] = [];
    trains[train_id].push({
        opuic: opuic,
        time: time,
        timestring: timestring.substring(11)
    });
});
for (let train_id in trains) {
    trains[train_id].sort((a, b) => {
        return a.time - b.time;
    });
}

var dataset = [];

// import reservations
const reservations_csv = fs.readFileSync(__dirname + '/data/reservations_clean.csv');
const reservations_records = csv.parse(reservations_csv, { columns: true, skip_empty_lines: true });
reservations_records.forEach(element => {
    const line_id = element['line'];
    const train_id = parseInt(element['train_nr']);
    const train = trains[train_id];
    if (train != undefined) {
        const start_opuic = stations[element['bp_from']];
        const end_opuic = stations[element['bp_to']];
        const lo = train.findIndex(element => element.opuic == start_opuic);
        const hi = train.findIndex(element => element.opuic == end_opuic);
        if (lo != -1 && hi != -1)
            for (let i = lo; i != hi; ++i) {
                const timestring = element['date'].substring(0, 10) + ' ' + train[i].timestring;
                dataset.push({
                    line: line_id,
                    train_nr: element['train_nr'],
                    from: train[i].opuic,
                    to: train[i + 1].opuic,
                    time: Date.parse(timestring),
                    res_time: Date.parse(element['res_dt']),
                    timestring: timestring,
                    reservations: parseFloat(element['reserved']),
                    capacity: parseFloat(element['capacity']),
                    metrics: []
                });
            }
    }
});

// prefix sum for reservations on same train ride
function compareDatasetElement(a, b) {
    if (a.train_nr.localeCompare(b.train_nr)) return a.train_nr.localeCompare(b.train_nr);
    else if (a.from.localeCompare(b.from)) return a.from.localeCompare(b.from);
    else if (a.to.localeCompare(b.to)) return a.to.localeCompare(b.to);
    else if (a.time != b.time) return a.time - b.time;
    else return a.res_time - b.res_time;
}

function compareDatasetElement2(a, b) {
    if (a.train_nr.localeCompare(b.train_nr)) return a.train_nr.localeCompare(b.train_nr);
    else if (a.from.localeCompare(b.from)) return a.from.localeCompare(b.from);
    else if (a.to.localeCompare(b.to)) return a.to.localeCompare(b.to);
    else return a.time - b.time;
}

dataset.sort(compareDatasetElement);
for (let i = 1; i < dataset.length; ++i) {
    if (compareDatasetElement2(dataset[i], dataset[i - 1]) == 0) {
        dataset[i].reservations += dataset[i - 1].reservations;
    }
}

// for (let i = 1; i < 5; ++i) console.log(dataset[i], compareDatasetElement(dataset[i - 1], dataset[i]));

// add metrics
time_metric.augment_dataset(dataset);
holiday_metric.augment_dataset(dataset);
weather_metric.augment_dataset(dataset);

// predict
let kmeans_data = {};
let kmeans_res = {};

dataset.forEach(dataset_el => {
    let key = [
        dataset_el.train_nr,
        dataset_el.from,
        dataset_el.to
    ];
    if (kmeans_data[key] == undefined)
        kmeans_data[key] = {
            trace: [],
            metrics: []
        };
    kmeans_data[key].trace.push(dataset_el);
    kmeans_data[key].metrics.push(dataset_el.metrics);
});

console.log("Preprocessing done.");

async function short_predict(train_nr, from, to, timestring, reservations) {
    let dataset_el = {
        train_nr: train_nr,
        from: from,
        to: to,
        time: Date.parse(timestring),
        timestring: timestring,
        metrics: []
    };
    time_metric.augment(dataset_el);
    holiday_metric.augment(dataset_el);
    await weather_metric.augment(dataset_el);

    const key = [
        dataset_el.train_nr,
        dataset_el.from,
        dataset_el.to
    ];

    if (kmeans_res[key] == undefined) {
        if (kmeans_data[key] == undefined) return [{delta: 0, prob: -1}];
        const size = kmeans_data[key].metrics.length;
        kmeans_res[key] = skmeans(kmeans_data[key].metrics, Math.min(size, 4));
    }

    let cluster = kmeans_res[key].test(dataset_el.metrics);
    let tmp = [];
    kmeans_data[key].trace.forEach((dataset_el, ind) => {
        if (kmeans_res[key].idxs[ind] == cluster.idx) {
            tmp.push({
                delta: dataset_el.res_time - dataset_el.time,
                fullness: dataset_el.reservations / dataset_el.capacity
            });
        }
    });
    tmp.sort((a, b) => a.delta - b.delta);
    
    let fullness = 0, tot = 0, density = [];
    tmp.forEach(el => {
        fullness += el.fullness;
        ++tot;
        density.push({
            delta: el.delta,
            prob: fullness / tot
        });
    })
    return density;
}

async function predict(train_nr, from, to, timestring, reservations) {
    let from_ind = trains[train_nr].findIndex(el => el.opuic == from);
    let to_ind = trains[train_nr].findIndex(el => el.opuic == to);

    if (from_ind == -1 || to_ind == -1) return [{delta: 0, prob: -1}];

    let density = [];

    if (from_ind < to_ind)
        for (let i = from_ind; i != to_ind; ++i) {
            let cur = trains[train_nr][i].opuic;
            let nxt = trains[train_nr][i + 1].opuic;
            density.push(...await short_predict(train_nr, cur, nxt, timestring, reservations));
        }
    else
        for (let i = from_ind; i != to_ind; --i) {
            let cur = trains[train_nr][i].opuic;
            let nxt = trains[train_nr][i - 1].opuic;
            density.push(...await short_predict(train_nr, cur, nxt, timestring, reservations));
        }

    density.sort((a, b) => a.delta - b.delta);
    for (let i = 1; i < density.length; ++i)
        density[i].prob = Math.max(density[i].prob, density[i - 1].prob);
    return density.filter(el => el.delta > -86400000 && el.delta < 0);
}

// predict(520, '8506000', '8506302', '2022-03-20 10:00:00', 6);

// API

const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const { resourceLimits } = require("worker_threads");
const port = process.env.PORT || "8000";

app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send("REST API is ready :)");
});

// returns a list of all stations
app.get("/stations", (req, res) => {

    let stations = new Set([]);
    let ids = new Set([]);
    dataset.forEach((element) => {
        if(!ids.has(element.from)) {
            let station1 = stations_records.find((el) => el['OPUIC'] == element.from)
            stations.add({id: element.from, name: station1['Stop name']})
            ids.add(element.from)
        }
        if(!ids.has(element.to)) {
            let station2 = stations_records.find((el) => el['OPUIC'] == element.to)
            stations.add({id: element.to, name: station2['Stop name']})
            ids.add(element.to)
        }
    })
    res.status(200).send(JSON.stringify(Array.from(new Set(stations))));
});


// adds zero e.g. before month
function addZero(num) {
    return num < 10 ? '0'+num : num;
}

// returns all trips between 2 stations
app.get("/trips/:fromId/:toId", (req, res) => {

    const fromId = req.params.fromId
    const toId = req.params.toId

    let trips = [];

    for (let train_id in trains) {
        const lo = trains[train_id].findIndex(element => element.opuic == fromId);
        const hi = trains[train_id].findIndex(element => element.opuic == toId);
        if (lo != -1 && hi != -1 && lo < hi) {
            let temp_train = trains_records.find((el) => el['Linie'] == train_id)
            trains[train_id][lo]['time_str'] = addZero(new Date(trains[train_id][lo]['time']).getHours())+ ':'+ addZero(new Date(trains[train_id][lo]['time']).getMinutes())
            trains[train_id][hi]['time_str'] = addZero(new Date(trains[train_id][hi]['time']).getHours())+ ':'+ addZero(new Date(trains[train_id][hi]['time']).getMinutes())
            trips.push({from: trains[train_id][lo], to: trains[train_id][hi], train: train_id, train_name: temp_train['Line Text']});
        }
    }

    res.status(200).send(JSON.stringify(trips));
});


// Returns all the possible destinations for a given station
app.get("/trips/:fromId", (req, res) => {

    const fromId = req.params.fromId

    let trips = [];

    for (let train_id in trains) {
        const lo = trains[train_id].findIndex(element => element.opuic == fromId);
        trains[train_id].forEach((element) => {
            const hi = trains[train_id].findIndex(el => el.opuic == element.opuic)
            if (lo != -1 && hi != -1 && lo < hi) {
                let temp_train = trains_records.find((el) => el['Linie'] == train_id)
                trains[train_id][lo]['time_str'] = addZero(new Date(trains[train_id][lo]['time']).getHours())+ ':'+ addZero(new Date(trains[train_id][lo]['time']).getMinutes())
                trains[train_id][hi]['time_str'] = addZero(new Date(trains[train_id][hi]['time']).getHours())+ ':'+ addZero(new Date(trains[train_id][hi]['time']).getMinutes())
                trips.push(element.opuic);
            }
        });
    }

    res.status(200).send(JSON.stringify(trips));
});

// Returns the probability distribution for
app.get("/prob/:train/:fromId/:toId/:bikes", async (req, res) => {

    const trainId = req.params.train
    const fromId = req.params.fromId
    const toId = req.params.toId
    const bikes = req.params.bikes

    console.log(trainId, fromId, toId, bikes)

    const result = await predict(trainId, fromId, toId, '2021-08-21 19:00:00', parseInt(bikes))

    res.status(200).send(JSON.stringify(result));
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
