
module.exports = {

  friendlyName: 'hardware remove',

  description: ' Add description ',

  inputs: {
    id: {
      description: "Remove hardware with ID",
      type: 'string',
      required: false
    },
    name: {
      description: "Remove hardware with Name",
      type: 'string',
      required: false
    },
    type: {
      description: "Remove hardware with Type (amount req1uired)",
      type: 'string',
      required: false
    },
    amount: {
      description: "Remove amount of hardware (type required) default is 1",
      type: 'number',
      required: false,
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
      viewTemplatePath: 'dc/graph'
    },
    json: {
      responseType: '', // with return json
    },
    notFound: {
      description: 'No hardware with id or name found',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {
    try {
      let hardware = null;
      if(inputs.id) {
        hardware = await Hardware.findOne({id:inputs.id}).populateAll();
        if(!hardware) {
          return exits.notFound(inputs);
        }
      }
      else if(inputs.name) {
        hardware = await Hardware.findOne({name:inputs.name}).populateAll();
        if(!hardware) {
          return exits.notFound(inputs);
        }
      }
      else if(inputs.type) {
        if (!inputs.amount) {
          inputs.amount = 1;
        }
        hardware = await Hardware.find({type: inputs.type, disabled: false}).populateAll();
        if (!hardware) {
          return exits.notFound(inputs);
        }
        hardware = hardware[0];
      }
      await Hardware.update({id:hardware.id}, {disable:true});
      // Move all of the instances to another piece of hardware
      if(hardware.resources.length > 0) {
        await sails.helpers.moveResources.with({resources: hardware.resources});
      }
      // Now remove the hardware.
      hardware = await Hardware.destroy({id:hardware.id}).fetch();
      sails.sockets.broadcast('fleet', 'hardware-destroy', hardware);
      if(inputs.mode === "json") {
        return exits.json(inputs);
      }
      else {
        return exits.success(inputs);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

