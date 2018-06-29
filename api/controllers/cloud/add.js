
module.exports = {

  friendlyName: 'cloud add',

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
      let cloud = await Cloud.findOrCreate({name:inputs.name}, {name:inputs.name}).fetch();

      // Display the results
      if(inputs.mode === 'json') {
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

