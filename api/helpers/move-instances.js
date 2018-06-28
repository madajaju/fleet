module.exports = {

  friendlyName: 'Move Instance',


  description: 'Allocate Resources',


  inputs: {
    instances: {
      description: 'Instances to Move',
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
    notEnoughResources: {
      description: 'Not enough resources available'
    }
  },

  fn: async function (inputs, exits) {
    try {
      let instances = inputs.instances;
      if(instances.length > 0) {
        let uinstances = [];
        for(let i=0; i < instances.length; i++)
        {
          let instance = instances[i];
          let ir = await sails.helpers.selectResource.with({type: 'compute', amount: 1});
          await CloudResource.addToCollection(ir.id, 'instances', instance.id);
          let resources = [ir.id];
          await ServiceInstance.addToCollection(instance.id, 'resources', resources);
          instance = await ServiceInstance.findOne(instance.id).populateAll();
          uinstances.push(instance);
        }
        sails.sockets.broadcast('fleet', 'instance', uinstances);
      }
      return exits.success(inputs);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

