module.exports = {
  friendlyName: 'Handle Events',
  description: 'Handle Events',

  inputs: {
    events: {
      description: 'Events',
      type: 'ref',
      required: true
    }
  },
  exits: {
    success: {
      responseType: 'model',
    },
    notFound: {
      description: 'Events not found',
    }
  },


  fn: async function (inputs, exits) {
    try {
      let events = await Events.findOne({id: inputs.events.id}).populateAll();
      for (let i = 0; i < events.triggers.length; i++) {
        // Connect the Service Instance to resources.
        let trigger = events.triggers[i];

        let flag = eval(trigger.condition);
        if (flag && !trigger.fired) {
          let actions = trigger.action.split(/;/);
          await Trigger.update({id: trigger.id}, {fired: true});
          trigger = await Trigger.findOne({id: trigger.id}).populateAll();
          sails.sockets.broadcast('fleet', 'triggered', trigger);
          for (let j = 0; j < actions.length; j++) {
            try {
              await eval(actions[j]);
            }
            catch (e) {
              console.error('Handle Event Error:', e);
            }
          }
        }
        else if (!flag && trigger.fired) {
          await Trigger.update({id: trigger.id}, {fired: false});
          trigger = await Trigger.findOne({id: trigger.id}).populateAll();
          sails.sockets.broadcast('fleet', 'triggered', trigger);
        }
      }
      // Load the Service again and broadcast change.
      return exits.success(events);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};


