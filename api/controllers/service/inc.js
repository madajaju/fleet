
module.exports = {

  friendlyName: 'service inc',

  description: ' Add description ',

  inputs: {
    id: {
      description: 'id of the service',
      type: 'number',
      required: false
    },
    name: {
       description: 'name of the service',
      type: 'string',
      required: false
    },
    amount: {
      description: 'amount to increment',
      type: 'number',
      required: false
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
      viewTemplatePath: 'dc/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'Service not found',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let service = null;
      console.log("Inc:", inputs);
      if(inputs.id) {
        service = await Service.findOne(inputs.id).populateAll();
      }
      else if(inputs.name) {
        service = await Service.findOne({name: inputs.name}).populateAll();
      }
      if(!service) { return exits.notFound('/dc/show');}
      if(!inputs.amount) { inputs.amount = 1; }
      service = await sails.helpers.incService(service, inputs.amount);
      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json(service);
      }
      else {
        // Display the welcome view.
        return exits.success(service);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

