module.exports = {

  friendlyName: 'cloud enable',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'name of the cloud',
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
      viewTemplatePath: 'welcome'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No cloud found',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let cloud = await Cloud.findOne({name: inputs.name});
      if (!cloud) {
        return exits.notFound('dc/graph');
      }
      await sails.helpers.disableCloud.with({cloud:cloud});
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(cloud);
      }
      else {
        // Display the welcome view.
        return exits.success(cloud);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

