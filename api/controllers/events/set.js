module.exports = {
  friendlyName: 'events set',
  description: ' Add description ',
  inputs: {
    name: {
      description: 'name of the events',
      type: 'string',
      required: true
    },
    amount: {
      description: 'number of the events',
      type: 'number',
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
      description: 'No events with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      let events = await sails.helpers.setEvents(inputs);
      if (!events) {
        return exits.notFound('dc/graph');
      }
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(events[0]);
      }
      else {
        // Display the welcome view.
        return exits.success(events[0]);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};
