module.exports = {


  friendlyName: 'Allocate resource',


  description: 'Allocate Resources',


  inputs: {
    type: {
      description: 'Type of Resource',
      type: 'string',
      required: false
    },
    name: {
      description: 'Name of Resource',
      type: 'string',
      required: false
    },
    amount: {
      description: 'Size of the Resource',
      type: 'number',
      required: false
    },
    replica: {
      description: 'Number of times to allocate it',
      type: 'number',
      required: false
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
      inputs.type = inputs.type.toLowerCase();
      if (!inputs.replica) {
        inputs.replica = 1;
      }
      if (!inputs.amount) {
        inputs.amount = 1;
      }
      let retval = null;
      let name = '';
      if(inputs.name) {
        name = inputs.name;
      }
      else {
        name = inputs.type[0] + (Math.round(Math.random() * 1000)).toString();
      }
      let hardware;
      for (let ri = 0; ri < inputs.replica; ri++) {
        hardware = await Hardware.find({type: inputs.type, disabled:false});
        let iname = name;
        if(!inputs.name && inputs.replica > 1) {
          iname += '-' + ri;
        }
        hardware = _.sortBy(hardware, 'available').reverse();
        let hi = 0;
        while (hi < hardware.length) {
          if (inputs.amount <= hardware[hi].available) {
            retval = await CloudResource.create({
              name: iname,
              capacity: inputs.amount,
              available: inputs.amount,
              type: inputs.type,
              disabled: false,
              hardware: hardware[hi].id
            }).fetch();
            await Hardware.update({id: hardware[hi].id}, {available: hardware[hi].available - 1});
            hi = hardware.length; // break out of the inner loop without breaking the outer loop.
          }
          hi++;
        }
      }
      if(!retval) {
        return exits.notEnoughHardware(inputs);
      }
      retval = await CloudResource.findOne(retval.id).populateAll();
      sails.sockets.broadcast('fleet', 'resource', retval);
      return exits.success(retval);
    }
    catch (e) {
      console.error('Allocate Resource error:', inputs);
      console.error(e);
      return exits.error(e);
    }
  }
};

