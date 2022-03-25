const fs = require('fs');
const axios = require('axios');

async function getLeisureScore(timestamp, uid) {
    const response = axios.get('https://weather.api.sbb.ch/' + timestamp + '/leisure_biking:idx/' + uid + '/json', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJOMDhQek52bDdqNGFfSlBmZ0FlZFNYTHNjcmprbmZ4OXppR2hxcHN1dkt3In0.eyJleHAiOjE2NDgxNjI4MTAsImlhdCI6MTY0ODE1ODMxMCwianRpIjoiMTQ2ZTAxYjUtZmU3Yy00OGZiLThjZmMtZDRjOTk3ODA0MWE4IiwiaXNzIjoiaHR0cHM6Ly9zc28uc2JiLmNoL2F1dGgvcmVhbG1zL1NCQl9QdWJsaWMiLCJhdWQiOiJhcGltLXdlYXRoZXJfc2VydmljZS1wcm9kLWF3cyIsInN1YiI6IjZjYmY0ZTRmLTJiZGItNDM2YS1hNDlhLTgzMjRmOThiNzNkNCIsInR5cCI6IkJlYXJlciIsImF6cCI6IjQwNzI1ZWM4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3Blci5zYmIuY2giXSwic2NvcGUiOiJjbGllbnQtaW5mbyBzYmJ1aWQgcHJvZmlsZSBlbWFpbCBTQkIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIyMTcuMTkyLjEwMi4xNCIsImNsaWVudElkIjoiNDA3MjVlYzgiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtNDA3MjVlYzgiLCJjbGllbnRBZGRyZXNzIjoiMjE3LjE5Mi4xMDIuMTQiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC00MDcyNWVjOEBwbGFjZWhvbGRlci5vcmcifQ.djJJ86Bycj15rKuGUDAd1aIkuHvPkO3mHwpgiz2pN920WK-vcti5godRFCH99TkyNARO6vg_bq63P8jqqT6N8XGPNzB9HmgAbrYjNFYvdDkoXKNQjPcUDRdh6nbdjPyzmwYnd3Y7pMMat4v1k8mItjYxTKLV-36U0zOV5FwKMI4MSJPj-zs5NquF4FGyY0O9P8yFBBkM4cGWc1t0iVlVQsZ10CZETXFino6pV_NZqaS6p35htSzK9fIFEt6VTXBVE9d7zjdXNehNkS2zqbkpbByByQyAN_I2KzFXQSSYgZ8H26FPksMqu_Rw7jYb6cjPJVx-QdRf8sz5AakMDbeCAA'
      }
    });
    let data = {};
    await response.then(response => {data = response.data.data[0].coordinates[0].dates})
    return data;
}

function load() {
    if (fs.existsSync('./data/weather.json')) {
        stationTimesWeatherDict = JSON.parse(
            fs.readFileSync('./data/weather.json')
        );
    }
}

function save() {
    let weatherJson = JSON.stringify(stationTimesWeatherDict)
    fs.writeFile("./data/weather.json", weatherJson, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

let cur = 0;
let stationTimesWeatherDict = {};

function get(opuic, timestring) {
    const datestring = timestring.substring(0, 10); // time is converted to 12:00:00 of the same day
    if (![opuic, datestring] in stationTimesWeatherDict) {
        console.error([opuic, datestring] + ' not found in weather dict!');
        return 0;
    }
    return stationTimesWeatherDict[[opuic, datestring]];
}

module.exports = {
    augment: function(dataset) {
        load();

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

        stationTimesDict.forEach(async el => {
            let station = 'didok_' + el.station;
            let dateString = '';
            Array.from(el.dates).sort().forEach((date) => {
                if (!([el.station, date] in stationTimesWeatherDict))
                    dateString += date + 'T12:00:00Z' + ',';
            });
            dateString = dateString.slice(0, -1);

            if (dateString.length != 0) {
                while (cur > 5) await snooze(300);
                ++cur;
                getLeisureScore(dateString, station).then(data => {
                    console.log('Queried weather API for ' + station);
                    data.forEach((elres) => {
                        stationTimesWeatherDict[[el.station, elres.date.slice(0,10)]] = elres.value
                    })
                    --cur;
                    // module.exports.save();
                })
            }
        });

        dataset.forEach(dataset_el => {
            // leisure index
            dataset_el.metrics.push(Math.max(
                get(dataset_el.from, dataset_el.timestring),
                get(dataset_el.to, dataset_el.timestring)
            ));
        });
    }
};