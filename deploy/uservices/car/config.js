module.exports = {
  fleet: 'http://localhost:1337/car/add', // hostname of the fleet
  dataCenter: { url:'http://localhost:1337/car/report'}, // hostname of the datacenter
  frequency: 5, // 1 minute
  data: {
    longitude: {type: 'number', min: 0, max: 1.0, step: 0.04, change: 0.25},
    latitude: {type: 'number', min: 0, max: 1.0, step: 0.04, change: 0.25},
    accident: {type: 'boolean', default: false, change: 0.10},
    vin: {type: 'number', min: 0, max: 999999999999999, step: 1, change: 0},
    color: {type: 'enum', values: ['red', 'black', 'tan', 'blue', 'pink', 'yellow', 'gray'], change: 0},
    make: {type: 'enum', values: ['Camry', 'Lexus', 'Forerunner'], change: 0},
    model: {type: 'enum', values: ['LX', 'LS', '300'], change: 0},
    year: {type: 'number', min: 2012, max: 2018, step: 1, change: 0},
    outsideTempature: {type: 'number', min: -20, max: 30, step: 0.1, change: 0.1},
    insdideTempature: {type: 'number', min: 15, max: 28, step: 0.1, change: 0.3},
  }
};
