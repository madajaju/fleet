module.exports = {

  friendlyName: 'car remove',

  description: ' Add description ',

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
      viewTemplatePath: '/car/list'
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

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let car = await Car.findOne({vin: inputs.vin});
      if (!car) {
        return exits.notFound('/car/list');
      }
      await Car.destroy({vin: inputs.vin});
      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json({vin: inputs.vin});
      }
      else {
        // Display the welcome view.
        return exits.success({vin: inputs.vin});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

