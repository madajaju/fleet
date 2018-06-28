
module.exports = {

  friendlyName: 'resource add',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'name of the hardware',
      type: 'string',
      required: true
    },
    amount: {
      description: 'amount of resources',
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
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No Hardware with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let hw = await Hardware.findOne({name: inputs.name, disable:false});
      if (!hw) {return exits.notFound('/signup');}
      if(inputs.amount < 1) { inputs.amount = 1 }
      let resource = await Resource.create({name: inputs.name})
      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json({hw: hw.name});
      }
      else {
        // Display the welcome view.
        return exits.success({hw: hw.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

