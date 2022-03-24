var fs = require("fs");
var csv = require("csv-parse/lib/sync");
const { start } = require("repl");
const axios = require('axios');

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

async function getLeisureScore(timestamp, uid) {
    const response = axios.get('https://weather.api.sbb.ch/' + timestamp + '/leisure_biking:idx/' + uid + '/json', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <API KEY>'
      }
    });
    let data = {};
    //console.log(response)
    // .coordinates[0].dates[0].value
    await response.then(response => {data = response.data.data[0].coordinates[0].dates})
    return data;
}

var tmp_dataset = [];
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
                tmp_dataset.push({
                    line: line_id,
                    from: start_opuic,
                    to: end_opuic,
                    time: Date.parse(element['dep_soll']),
                    timestring: element['dep_soll'],
                    reservations: parseFloat(element['reserved']),
                    capacity: parseFloat(element['capacity']),
                    leisure_idx: null,
                    holiday: 0,
                    weekend: 0
                });
            }
    }
});
tmp_dataset.sort((a, b) => {
    if (a.line != b.line) return a.line < b.line;
    else if (a.from != b.from) return a.from < b.from;
    else if (a.to != b.to) return a.to < b.to;
    else return a.time - b.time;
});
tmp_dataset.forEach(element => {
    if (dataset.length == 0) dataset.push(element);
    else {
        var last = dataset[dataset.length - 1];
        if (last.line == element.line && last.from == element.from && last.to == element.to && last.time == element.time)
            last.reservations += element.reservations;
        else dataset.push(element);
    }
});


// import holidays
const hd_csv = fs.readFileSync(__dirname + '/data/school_holidays_clean.csv');
const hd_records = csv.parse(hd_csv, { delimiter: ',', columns: true, skip_empty_lines: true });
console.log(hd_records.length)
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

//console.log(dataset)

// READY

stationTimesDict = [];

dataset.forEach(function(element) {
    if (stationTimesDict.length == 0) stationTimesDict.push({station: element.from, dates: new Set([element.timestring.split(' ')[0]])});
    else {
        let fromIdx = stationTimesDict.findIndex((el) => el.station == element.from);
        let toIdx = stationTimesDict.findIndex((el) => el.station == element.to);

        if (fromIdx == -1) {
            stationTimesDict.push({station: element.from, dates: new Set([element.timestring.split(' ')[0]])});
        } else {
            stationTimesDict[fromIdx].dates.add(element.timestring.split(' ')[0])
        }

        if (toIdx == -1) {
            stationTimesDict.push({station: element.to, dates: new Set([element.timestring.split(' ')[0]])});
        } else {
            stationTimesDict[toIdx].dates.add(element.timestring.split(' ')[0])
        }
    }
});

console.log(stationTimesDict.length)


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


let stationTimesWeatherDict = {};

let cnt = 0, respC = 0;
stationTimesDict.forEach((el, idx, arr) => {
    cnt++;

    let station = 'didok_' + el.station;
    let dateString = '';
    Array.from(el.dates).sort().forEach((date) => {
        dateString += date + 'T12:00:00Z,'
    });
    dateString = dateString.slice(0, -1)

    console.log('starting req')

    getLeisureScore(dateString, station).then(data => {
        // stationTimesWeatherDict[station + date] = data;
        data.forEach((elres) => {
            stationTimesWeatherDict[[el.station, elres.date.slice(0,10)]] = elres.value
        })

    })

    sleep(3000);

    weatherJson = JSON.stringify(stationTimesWeatherDict)

    fs.writeFile("weather.json", weatherJson, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });

    console.log(stationTimesWeatherDict)
});



