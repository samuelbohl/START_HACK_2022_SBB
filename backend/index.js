const fs = require("fs");
const csv = require("csv-parse/lib/sync");
const { start } = require("repl");
const skmeans = require('skmeans');
const weather = require('./weather-api');

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
    let time = element['Arrival time'].length != 0
        ? Date.parse(element['Arrival time'])
        : Date.parse(element['Departure time']);
    time -= Date.parse(element['Day of operation']);
    if (trains[train_id] == undefined) trains[train_id] = [];
    trains[train_id].push({
        opuic: opuic,
        time: time
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
                const timestring = element['dep_soll'];
                dataset.push({
                    line: line_id,
                    from: start_opuic,
                    to: end_opuic,
                    time: Date.parse(timestring),
                    timestring: timestring,
                    reservations: parseFloat(element['reserved']),
                    capacity: parseFloat(element['capacity']),
                    rel_time: (Date.parse(timestring) - Date.parse(timestring.substring(0, 10) + ' 00:00:00')) / 86400000,
                    leisure_idx: null,
                    holiday: 0,
                    weekend: 0
                });
            }
    }
});
dataset.sort((a, b) => {
    if (a.line != b.line) return a.line < b.line;
    else if (a.from != b.from) return a.from < b.from;
    else if (a.to != b.to) return a.to < b.to;
    else return a.time - b.time;
});
dataset.forEach((element, ind, arr) => {
    if (ind != 0 && arr[ind - 1].line == element.line && arr[ind - 1].from == element.from && arr[ind - 1].to == element.to && arr[ind - 1].time == element.time)
        element.reservations += arr[ind - 1].reservations;
    element.fullness = element.reservations / element.capacity;
});


// import holidays
const hd_csv = fs.readFileSync(__dirname + '/data/school_holidays_clean.csv');
const hd_records = csv.parse(hd_csv, { delimiter: ',', columns: true, skip_empty_lines: true });

let total_pop = 0
hd_records.forEach(element => {
    let pop = parseInt(element['Population'].split(',').join(''));
    total_pop += pop;
});

total_pop = total_pop/2;

hd_records.forEach((element, idx, arr) => {
    let pop = parseInt(element['Population'].split(',').join(''));
    arr[idx]['Population'] = pop/total_pop
    arr[idx]['Spring'] = Date.parse(arr[idx]['Spring'])
    arr[idx]['SpringEnd'] = Date.parse(arr[idx]['SpringEnd'])
    arr[idx]['Summer'] = Date.parse(arr[idx]['Summer'])
    arr[idx]['SummerEnd'] = Date.parse(arr[idx]['SummerEnd'])
    arr[idx]['Fall'] = Date.parse(arr[idx]['Fall'])
    arr[idx]['FallEnd'] = Date.parse(arr[idx]['FallEnd'])
});

dataset.forEach((element, idx, arr) => {
    let holiday = 0;
    hd_records.forEach(el => {
        if (element.time >= el.Spring && element.time <= el.SpringEnd) {
            holiday += el.Population;
        } else if (element.time >= el.Summer && element.time <= el.SummerEnd) {
            holiday += el.Population;
        } else if (element.time >= el.Fall && element.time <= el.FallEnd) {
            holiday += el.Population;
        }
    });
    arr[idx]['holiday'] = holiday;
    arr[idx]['weekend'] = (new Date(element.time)).getDay() >= 5 ? 1 : 0;
});

// get weather data
weather.init(dataset);
dataset.forEach(element => {
    element.leisure_idx = Math.max(
        weather.get(element.from, element.timestring),
        weather.get(element.to, element.timestring)
    );
});

console.log(dataset[0]);

// k-means
let kmeans_data = [];
dataset.forEach(element => {
    kmeans_data.push([
        element.rel_time,
        element.leisure_idx,
        element.holiday,
        element.weekend
    ]);
});
let kmeans_res = skmeans(kmeans_data, 16);

// API

const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const port = process.env.PORT || "8000";

app.use(cors());


app.get("/", (req, res) => {
    res.status(200).send("WHATABYTE: Food For Devs");
});

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

app.get("/trips/:fromId/:toId", (req, res) => {

    const fromId = req.params.fromId
    const toId = req.params.toId
    //const time = req.params.time

    let trips = [];

    for (let train_id in trains) {
        const lo = trains[train_id].findIndex(element => element.opuic == fromId);
        const hi = trains[train_id].findIndex(element => element.opuic == toId);
        if (lo != -1 && hi != -1 && lo < hi) {
            let temp_train = trains_records.find((el) => el['Linie'] == train_id)
            trains[train_id][lo]['time'] = new Date(trains[train_id][lo]['time']).getHours( )+ ':'+ new Date(trains[train_id][lo]['time']).getMinutes()
            trains[train_id][hi]['time'] = new Date(trains[train_id][hi]['time']).getHours( )+ ':'+ new Date(trains[train_id][hi]['time']).getMinutes()
            trips.push({from: trains[train_id][lo], to: trains[train_id][hi], train: train_id, train_name: temp_train['Line Text']});
        }
    }

    res.status(200).send(JSON.stringify(trips));
});


app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
