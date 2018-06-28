
module.exports = {

  friendlyName: 'car list',

  description: ' Add description ',

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
      viewTemplatePath: 'car/list'
    },
    json: {
      responseType: '', // with return json
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'fleet');
    }
    try {
      let cars = await Car.find();
      console.log("Sails", sails.helpers);

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json({cars: cars});
      }
      else {
        // Display the welcome view.
        return exits.success({cars: cars});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

