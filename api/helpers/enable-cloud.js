module.exports = {

  friendlyName: 'Enable Cloud',
  description: 'Enable Cloud',

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
      cloud = await Cloud.update({name:inputs.name}, {disabled: false}).fetch();
      cloud = cloud[0];

      let hardware = Hardware.find({cloud: cloud});
      for(let i in hardware) {
        await Hardware.update({id:hardware[i].id},{disabled:false});
      }
      return exits.success(cloud);
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};


