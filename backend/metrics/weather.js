const fs = require('fs');
const axios = require('axios');
const oauth = require('axios-oauth-client');

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
let stationTimesWeatherDict = {};

// Create the Auth Token - Returns a Promise with the token
async function getAuthToken() {
    const getClientCredentials = oauth.client(axios.create(), {
        url: 'https://sso.sbb.ch/auth/realms/SBB_Public/protocol/openid-connect/token',
        grant_type: 'client_credentials',
        client_id: '40725ec8',
        client_secret: '71128e76d206db0a348be7822e08d561',
        scope: ''
    });

    const auth = await getClientCredentials();
    return auth.access_token;
}

let cur = 0;
async function getLeisureScore(timestamp, uid) {
    while (cur > 5) await snooze(200);
    ++cur;

    const response = axios.get('https://weather.api.sbb.ch/' + timestamp + '/leisure_biking:idx/' + uid + '/json', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': await getAuthToken()
      }
    });

    let data = {};
    await response.then(response => {data = response.data.data[0].coordinates[0].dates})
    console.log('Queried weather API for ' + uid);
    data.forEach(elres => {
        let station = uid.substring(6);
        // console.log([station, elres.date.slice(0,10)] + ' = ' + elres.value);
        stationTimesWeatherDict[[station, elres.date.slice(0,10)]] = parseFloat(elres.value)
    })

    --cur;

    // save();
}

function load() {
    if (fs.existsSync('./data/weather.json')) {
        console.log('Loaded weather data.');
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

async function get(opuic, timestring) {
    const datestring = timestring.substring(0, 10);
    if (!([opuic, datestring] in stationTimesWeatherDict)) {
        const station = 'didok_' + opuic;
        const timestring = datestring + 'T12:00:00Z';
        await getLeisureScore(timestring, station);
    }

    return stationTimesWeatherDict[[opuic, datestring]];
}

module.exports = {
    augment: async function(dataset_el) {
        const tmp = Math.max(
            await get(dataset_el.from, dataset_el.timestring),
            await get(dataset_el.to, dataset_el.timestring)
        );
        dataset_el.metrics.push(tmp);
    },
    // must be called before augment
    augment_dataset: function(dataset) {
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

        stationTimesDict.forEach(el => {
            let station = 'didok_' + el.station;
            let dateString = '';
            Array.from(el.dates).sort().forEach((date) => {
                if (!([el.station, date] in stationTimesWeatherDict))
                    dateString += date + 'T12:00:00Z' + ',';
            });
            dateString = dateString.slice(0, -1);
            if (dateString.length != 0)
                getLeisureScore(dateString, station)
        });

        dataset.forEach(module.exports.augment);
    }
};