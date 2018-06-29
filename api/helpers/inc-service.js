module.exports = {


  friendlyName: 'Increment Service',

  description: 'Increment Service',


  inputs: {
    service: {
      description: 'Service',
      type: 'ref',
      required: true
    },
    amount: {
      description: 'amount to increment the Service',
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
      description: 'Service no found!'
    }
  },


  fn: async function (inputs, exits) {
    try {
      let serv = inputs.service;
      if(typeof serv === 'string') {
        serv = await Service.findOne({name: serv}).populateAll();
        if(!serv) { return exits.notFound(serv); }
      }
      let uinstances = [];
      for (let si = 0; si < inputs.amount; si++) {
        // Connect the Service Instance to resources.
        let instance = await ServiceInstance.create({
          name: serv.name + si,
          service: serv.id,
          sid: serv.instances.length
        }).fetch();
        let ir = await sails.helpers.selectResource.with({type: 'compute', amount: 1});
        await CloudResource.addToCollection(ir.id, 'instances', instance.id);
        let resources = [ir.id];
        await ServiceInstance.addToCollection(instance.id, 'resources', resources);
        instance = await ServiceInstance.findOne(instance.id).populateAll();
        uinstances.push(instance);
      }
      sails.sockets.broadcast('fleet', 'instance', uinstances);
      // Load the Service again and broadcast change.
      serv = await Service.findOne(serv.id).populateAll();
      sails.sockets.broadcast('fleet', 'service', serv);
      return exits.success(serv);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

