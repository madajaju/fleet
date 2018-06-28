module.exports = {


  friendlyName: 'Allocate resource',


  description: 'Allocate Resources',


  inputs: {
    resources: {
      description: 'Resources to Move',
      type: ['ref'],
      required: true
    },
    mode: {
      description: 'mode to return',
      type: 'string',
      required: false
    }
  },

  exits: {
    success: {
      responseType: 'model',
    },
    notEnoughHardware: {
      description: 'Not enough resources available'
    }
  },

  fn: async function (inputs, exits) {
    // All done.
    try {
      let resources = inputs.resources;
      if(resources.length > 0) {
        let hi = 0;
        let ri = 0;
        let resource = resources[0];
        let hardware = await Hardware.find({type: resource.type, disabled: false});
        hardware = _.sortBy(hardware, 'available').reverse();
        while(hi < hardware.length && ri < resources.length) {
          if (hardware[hi].available > 0) {
            await Hardware.update({id:hardware[hi].id}, {available: hardware[hi].available -1}).fetch();
            await CloudResource.update({id:resources[ri].id}, {hardware:hardware[hi].id});
            let ress = await CloudResource.findOne(resources[ri].id).populateAll();
            let hw = await Hardware.findOne(hardware[hi].id).populateAll();
            await sails.sockets.broadcast('fleet', 'resource-move', {resource:ress,hardware:hw});
            ri++;
            hi=0;
          }
          hi++;
        }
        if(ri < resources.length) {
          return exits.notEnoughHardware(inputs);
        }
        return exits.success(inputs);
      }
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

