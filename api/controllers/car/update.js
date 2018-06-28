module.exports = {

  friendlyName: 'car update',

  description: 'Update the configuration of the Car',

  inputs: {
    vin: {
      description: 'VIN of the car',
      type: 'string',
      required: true
    },
    config: {
      description: 'Config of the car simulation',
      type: 'json',
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
      viewTemplatePath: 'car/list'
    },
    json: {
      responseType: '', // with return json
    },
    duplicate: {
      description: 'Duplicate Car',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let car = await Car.findOne({vin: inputs.vin});
      if (car) {
        return exits.duplicate('/car/list');
      }
      else {
        car = await Car.update({vin: inputs.vin}, {config: inputs.config}).fetch();

        sails.sockets.broadcast('fleet', 'car', car[0]);
        // Display the results
        if (inputs.mode === 'json') {
          // Return json
          return exits.json({car: car});
        }
        else {
          // Display the welcome view.
          return exits.success({car: car});
        }
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

