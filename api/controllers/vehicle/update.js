async function simulateVehicle(vehicle) {

  try {
    sails.sockets.broadcast('fleet', 'vehicle', vehicle);
    // Ok we calculate events based on the change vehicles.
    let ingestion = Math.round((vehicle.population * vehicle.packetSize) / 60);
    let accidents = Math.round(vehicle.population * vehicle.accidents);
    let tps = Math.round(vehicle.population / 60);
    // ingestion
    await sails.helpers.setEvents('ingestion', ingestion);
    await sails.helpers.setEvents('accident', accidents);
    await sails.helpers.setEvents('tps', tps);

    // Update the Util event here.

  }
  catch (e) {
    console.error("Simulate Car:", e);
  }

  setTimeout(async function () {
    let car = await Vehicle.findOne({name: 'First'});
    let crange = car.population * car.change;
    car.population += (crange / 2) - (Math.random() * crange);

    let prange = car.packetSize * car.change;
    car.population += (prange / 2) - (Math.random() * prange);

    let arange = car.accidents * car.change;
    car.population += (arange / 2) - (Math.random() * arange);
    // await Vehicle.update({id: car.id}, car);
    await simulateVehicle(car);
  }, vehicle.freq);
  return vehicle;
}

module.exports = {

  friendlyName: 'vehicle update',

  description: ' Add description ',

  inputs: {
    population: {
      description: 'Population of Vehicles',
      type: 'number',
      required: false
    },
    accidents: {
      description: 'Percentage of vehicles in accident',
      type: 'number',
      required: false
    },
    packetSize: {
      description: 'Packet Size',
      type: 'number',
      required: false
    },
    change: {
      description: 'Amount of change',
      type: 'number',
      required: false
    },
    freq: {
      description: 'How often it changes',
      type: 'number',
      required: false
    },
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      if (!inputs.change) {
        inputs.change = 0.1;
      }
      if (!inputs.freq) {
        inputs.freq = 10000;
      }

      let vehicle = await Vehicle.find({name: "First"});
      if (vehicle.length < 1) {
        vehicle = await Vehicle.create({
          name: "First",
          population: 0,
          packetSize: 0,
          accidents: 0,
          freq: inputs.freq,
          change: inputs.change
        }).fetch();
      }
      vehicle = await Vehicle.update({name: "First"}, inputs).fetch();
      simulateVehicle(vehicle[0]);

      if (inputs.mode === 'json') {
        // Return json
        return exits.json(vehicle);
      }
      else {
        // Display the welcome view.
        return exits.success(vehicle);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

