module.exports = {
  friendlyName: 'Set Events value',
  description: 'Set Events value',

  inputs: {
    events: {
      description: 'Events',
      type: 'ref',
      required: true
    },
    value: {
      description: 'value of the Events',
      type: 'number',
      required: false
    },
  },
  exits: {
    success: {
      responseType: 'model',
    },
    notEnoughResource: {
      description: 'Not enough resources available'
    },
    notFound: {
      description: 'Events no found!'
    }
  },


  fn: async function (inputs, exits) {
    try {
      let event = inputs.events;
      if(typeof event === 'string') {
        event = await Events.findOne({name: event}).populateAll();
        if(!event) { return exits.notFound(event); }
      }
      event = await Events.update({id: event.id}, {value: inputs.value}).fetch();
      sails.sockets.broadcast('fleet', 'events', event[0]);
      await sails.helpers.handleEvents(event[0]);
      return exits.success(event[0]);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
}
;

