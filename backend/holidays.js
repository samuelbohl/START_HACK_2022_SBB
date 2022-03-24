const fs = require('fs');
const csv = require("csv-parse/lib/sync");

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

module.exports = {
    get: function(dataset_el) {
        let res = 0;
        hd_records.forEach(el => {
            if (dataset_el.time >= el.Spring && dataset_el.time <= el.SpringEnd) {
                res += el.Population;
            } else if (dataset_el.time >= el.Summer && dataset_el.time <= el.SummerEnd) {
                res += el.Population;
            } else if (dataset_el.time >= el.Fall && dataset_el.time <= el.FallEnd) {
                res += el.Population;
            }
        });
        return res;
        // dataset_el.holiday = res;
        // dataset_el.weekend = (new Date(dataset_el.time)).getDay() >= 5 ? 1 : 0;
    }
}