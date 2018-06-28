module.exports = {

  friendlyName: 'events list',

  description: ' Add description ',

  inputs: {
    mode: {
      description: "results format: json or html",
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'event/list'
    },
    json: {
      responseType: '', // with return json
    },
  },

  fn: async function (inputs, exits, env) {
    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'fleet');
    }

    try {
      let events = await Events.find();
      // Display the results
      if (inputs.mode === "json") {
        // Return json
        return exits.json(events);
      }
      else {
        // Display the welcome view.
        return exits.success(events);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

