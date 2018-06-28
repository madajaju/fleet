var YAML = require('yamljs');

module.exports = {

  friendlyName: 'app create',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Name of the application to deploy',
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
      let filename = 'assets/';
      if (inputs.name === 'Alert') {
        filename += 'app.yaml';
      }
      else if (inputs.name === 'Basic') {
        filename += 'app2.yaml';
      }
      else if (inputs.name === 'External') {
        filename += 'externalApp.yaml';
      }
      else if (inputs.name === 'Analytics') {
        filename += 'analyticsApp.yaml';
      }
      else if (inputs.name === 'DeepLearning') {
        filename += 'DLApp.yaml';
      }
      const app = YAML.load(filename);
      await sails.helpers.addApplication.with(app);

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json("ok");
      }
      else {
        // Display the welcome view.
        return exits.success("ok");
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

