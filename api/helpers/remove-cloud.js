module.exports = {

  friendlyName: 'Remove Cloud',
  description: 'Remove Cloud',

  inputs: {
    cloud: {
      description: 'Cloud',
      type: 'ref',
      required: true
    },
  },
  exits: {
    success: {
      responseType: 'model',
    },
    notFound: {
      description: 'Cloud not found'
    }
  },


  fn: async function (inputs, exits) {
    try {
      let cloud = inputs.cloud;
      if (typeof cloud === 'string') {
        cloud = Cloud.findOne({name: cloud}).populateAll();
      }
      if(!cloud) {
        return this.exits.notFound('dc/graph');
      }
      cloud = await Cloud.update({id:cloud.id}, {disabled: true}).fetch();
      cloud = cloud[0];

      let hardware = await Hardware.find({cloud: cloud.id});

      for(let i=0; i < hardware.length; i++) {
        await Hardware.update({id:hardware[i].id},{disabled:true});
      }
      for(let i=0; i < hardware.length; i++) {
        let hw = await Hardware.findOne({id: hardware[i].id}).populateAll();
        if(hw.resources.length > 0) {
          await sails.helpers.moveResources.with({resources: hw.resources});
        }
      }
      await Hardware.destroy({cloud:cloud.id});
      await sails.sockets.broadcast('fleet', 'hardware-destroy', hardware);
      await Cloud.destroy({id:cloud.id});
      await sails.sockets.broadcast('fleet', 'cloud-destroy', [cloud]);
      return exits.success(cloud);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};


