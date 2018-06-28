const {send} = require('micro');
const {URL, URLSearchParams} = require('url');
const fetchJson = require('node-fetch-json');
let config = require('./config');
const Car = require('./Car');
const DataCenter = require('./DataCenter');


// Registr back with the fleet. Fleet URL should be via configuration file.
// Put in a loop to Wait for a request.
//    dataCenter=URL // URL of the DataCenter to stream telemetry too.
//    settings=json // JSON of new settings for the car
// Every X seconds (frequency) send data to the dataCenter.
// Settings JSON contains all of the data that will be generated.
// Each item in the data section of the config file contains information about the data, frequency, range and probability
//  of change. This micro-service will take configuration data and periodically based on frequency change the data.

// Send data to the DataCenter
// The micro-service should als be able to handle changes in the data configurations, datacenter connectivity,
// or any other configuration value.

// Simulate car runs in a loop based on the frequency in the config file.
async function simulateCar(car, dc) {
  car.generateData();
  // Set timeout to run generate and send in <fequency> seconds
  setTimeout(() => {
    car.generateData();
    dc.send(car);
    // Call simulateCar again to trigger.
    simulateCar(car, dc);
  }, car.config.frequency * 1000);
}

// Create a car
let dc = new DataCenter(config.dataCenter);
let cars = [];
let numOfCars = 10;
for (let i = 0; i < numOfCars; i++) {
  cars[i] = new Car(dc, config);
}
for (let i = 0; i < cars.length; i++) {
  simulateCar(cars[i], dc);
}

module.exports = async function (req, res) {
  const url = 'http://' + req.headers.host + req.url;
  const myURL = new URL(url);
  const newSearchParams = new URLSearchParams(myURL.searchParams);
  const id = newSearchParams.get('id');
  const callback = newSearchParams.get('callback');

  if (callback) {
    console.log('Callback:', callback);
    const response = await fetch(callback);
    const json = await response.text();
    console.log(json);
  }
  send(res, 200, 'Got it');
};
