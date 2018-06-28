
module.exports = {

  friendlyName: 'car show',

  description: 'Show the Car information',

  inputs: {
    vin: {
      description: 'VIN of the Car',
      type: 'string',
      required: true
    },

    mode: {
      description: "results format: json or html",
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: '/car/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No car with the VIN found',
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
      if (!car) {
        return exits.notFound('/car/list');
      }
      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({car: car});
      }
      else {
        // Display the welcome view.
        return exits.success({car: car});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

