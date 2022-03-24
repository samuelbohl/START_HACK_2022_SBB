var fs = require("fs");
var csv = require("csv-parse/lib/sync");
const { start } = require("repl");

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
                    reservations: parseFloat(element['reserved']),
                    capacity: parseFloat(element['capacity'])
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