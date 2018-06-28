module.exports = {

  friendlyName: 'app list',

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
      viewTemplatePath: 'app/list'
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
    // if this is a socket then add it to the fleet room
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'fleet');
    }
    try {
      let list = await Application.find().populateAll();
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(list);
      }
      else {
        // Display the welcome view.
        return exits.success(list);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

