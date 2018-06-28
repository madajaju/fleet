module.exports = {

  friendlyName: 'events dec',

  description: ' Add description ',

  inputs: {
    name: {
      description: "Name of the event",
      type: 'string',
      required: true
    },
    amount: {
      description: "amount of events",
      type: 'number',
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
      viewTemplatePath: 'dc/show'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No event with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      if (!inputs.amount) { inputs.amount = 1; }
      let event = await Events.findOne({name: inputs.name});
      event = await Events.update({id: event.id}, {value: event.value - inputs.amount}).fetch();
      sails.sockets.broadcast('fleet', 'events', event[0]);
      await sails.helpers.handleEvents(event[0]);
      if (inputs.mode === "json") {
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

