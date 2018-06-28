
module.exports = {

  friendlyName: 'vehicle list',

  description: 'List Vehicles',

  inputs: {
    mode: {
      description: 'results format: json or html',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'dc/graph'
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
      let vehicles = await Vehicle.find();
      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(vehicles);
      }
      else {
        // Display the welcome view.
        return exits.success(vehicles);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

