module.exports = {

  friendlyName: 'hardware add',

  description: ' Add description ',

  inputs: {
    name: {
      description: 'Hardware hardware with Name prefix',
      type: 'string',
      required: true
    },
    type: {
      description: 'Add hardware with Type (amount req1uired)',
      type: 'string',
      required: true
    },
    amount: {
      description: 'Add amount of hardware (type required) default is 1',
      type: 'number',
      required: false,
    },
    capacity: {
      description: 'Capacity of the Hardware',
      type: 'number',
      required: false,
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
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      if (!inputs.amount) {
        inputs.amount = 1;
      }
      if (!inputs.capacity) {
        if (inputs.type === 'storage') {
          inputs.capacity = 100000;
        }
        else if (inputs.type === 'compute') {
          inputs.capacity = 28;
        }
        else if (inputs.type === 'network') {
          inputs.capacity = 254
          l
        }
      }
      for (let i = 0; i < inputs.amount; i++) {
        let rand = Math.round(Math.random() * 1000);
        let item = {
          name: inputs.name + rand + '-' + i,
          type: inputs.type,
          available: inputs.capacity,
          capacity: inputs.capacity,
          disabled: false
        };
        let hardware = await Hardware.create(item).fetch();
        sails.sockets.broadcast('fleet', 'hardware', hardware);
      }

      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json('ok');
      }
      else {
        // Display the welcome view.
        return exits.success('ok');
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

