module.exports = {


  friendlyName: 'Decrement Service',

  description: 'Decrement Service',


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
    }
  },


  fn: async function (inputs, exits) {
    try {
      let serv = inputs.service;
      if(typeof serv === 'string') {
        serv = await Service.findOne({name: serv}).populateAll();
        if(!serv) { return exits.notEnoughResource(serv); }
      }
      let ri = [];
      for (let si = 0; si < inputs.amount && si < serv.instances.length; si++) {
        ri.push(serv.instances[si].id);
        // need to free up the available on the Resource this was running.
        let inst = await ServiceInstance.findOne({id: serv.instances[si].id}).populateAll();
        for(let j=0; j < inst.resources.length; j++) {
          let resource = inst.resources[j];
          await CloudResource.update({id:resource.id}, {available: resource.available+1});
        }
      }

      let instances = await ServiceInstance.destroy({id: { in: ri}}).fetch();
      sails.sockets.broadcast('fleet', 'instance-destroy', instances);

      // await Service.removeFromCollection(serv.id, 'instances').members(ri);
      // Load the Service again and broadcast change.
      serv = await Service.findOne(serv.id).populateAll();
      console.log("Now there are ", serv.instances.length);
      sails.sockets.broadcast('fleet', 'service', serv);
      return exits.success(serv);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
}
;

