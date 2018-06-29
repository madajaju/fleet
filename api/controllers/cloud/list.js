
module.exports = {

  friendlyName: 'cloud list',

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
      let clouds = await Cloud.find().populateAll();

      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(clouds);
      }
      else {
        // Display the welcome view.
        return exits.success(clouds);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

