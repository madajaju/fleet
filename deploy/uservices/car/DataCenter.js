const fetchJson = require('node-fetch-json');
const config = require('./config');
module.exports = class DataCenter {
  constructor(config) {
    this.url = config.url;
  }

  async send(car) {
    const data = {vin: car.data.vin, data:car.data};
    let url = config.dataCenter.url + '?mode=json&vin=' + data.vin;
    console.log(url);
    try {
      await fetchJson(url, {method: 'POST', body: data});
    }
    catch(e) {
      console.error(e);
    }
  }
  async sendAdd(car) {
    let data = {vin: car.data.vin, data: car.config};
    let url = config.fleet + '?mode=json&vin=' + data.vin;
    console.log(url);
    try {
      await fetchJson(url, {method: 'POST', body: data});
    }
    catch (e) {
      console.error(e);
    }
  }
};
