module.exports = {

  friendlyName: 'trigger enable',

  description: 'Enable trigger after it has been disabled',

  inputs: {
    id: {
      description: "id of the trigger",
      type: 'string',
      required: false
    },
    name: {
      description: "name of the trigger",
      type: 'string',
      required: false
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
      let trigger =null;
      if(inputs.id) {
        trigger = await Trigger.findOne(inputs.id);
      }
      else if(trigger.name) {
        trigger = await Trigger.findOne({name:inputs.name});
      }
      if (!trigger) {return exits.notFound('/dc/show');}

      trigger = await Trigger.update({id:trigger.id}, {enabled: true}).fetch();

      // Display the results
      if(inputs.mode === "json") {
        // Return json
        return exits.json(trigger[0]);
      }
      else {
        // Display the welcome view.
        return exits.success(trigger[0]);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

