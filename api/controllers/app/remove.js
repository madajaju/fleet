
module.exports = {

  friendlyName: 'app remove',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Name of the Application to remove',
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

    try {
      let app = await Application.findOne({name:inputs.name});
      if (!app) {return exits.notFound('/dc/graph');}
      await Application.destroy({name:inputs.name});
      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json({name: inputs.name});
      }
      else {
        // Display the welcome view.
        return exits.success({name: inputs.name});
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

