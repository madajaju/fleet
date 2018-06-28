
module.exports = {

  friendlyName: 'events remove',

  description: ' Add description ',

  inputs: {
     name: {
      description: "Name of the event",
      type: 'string',
      required: true
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
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let event = await Events.destroy({name:inputs.name}).fetch();
      sails.sockets.broadcast('fleet', 'events', event);
      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json(event);
      }
      else {
        // Display the welcome view.
        return exits.success(event);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

