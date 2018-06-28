module.exports = {

  friendlyName: 'car report',

  description: ' Add description ',

  inputs: {
    vin: {
      description: 'Description of Attribute',
      type: 'string',
      required: true
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
      viewTemplatePath: '/car/list'
    },
    json: {
      responseType: '', // with return json
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let user = await Car.findOne({vin: inputs.vin});
      if (user) {
        let data = this.req.body.data;
        let car = await Car.update({vin: inputs.vin}, {data: data}).fetch();
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

