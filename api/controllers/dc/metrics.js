
module.exports = {

  friendlyName: 'dc metrics',
  description: 'Get Data Center Metrics',

  inputs: {
    mode: {
      description: 'results format: json or html',
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
      description: 'No user with the specified ID was found in the database.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    try {
      let retval =  {hardware:{},resources:{},services:{}, apps:{}, instances:{}};

      let hardware = await Hardware.find();
      for(let i = 0; i < hardware.length; i++) {
        let hw = hardware[i];
        if(!retval.hardware.hasOwnProperty(hw.type))  {
          retval.hardware[hw.type] = {total:0,available:0,capacity:0};
        }
        retval.hardware[hw.type].total++;
        retval.hardware[hw.type].available += hw.available;
        retval.hardware[hw.type].capacity += hw.capacity;
      }
      let util = Math.round(100 - 100*(retval.hardware.compute.available/retval.hardware.compute.capacity));
      await sails.helpers.setEvents('util', util);

      let resources = await CloudResource.find();
      for(let i = 0; i < resources.length; i++) {
        let resource = resources[i];
        if(!retval.resources.hasOwnProperty(resource.type))  {
          retval.resources[resource.type] = {total:0,available:0,capacity:0};
        }
        retval.resources[resource.type].total++;
        retval.resources[resource.type].available += resource.available;
        retval.resources[resource.type].capacity += resource.capacity;
      }
      retval.services =  await Service.count();
      retval.instances = await ServiceInstance.count();
      retval.apps = await Application.count();
      await sails.helpers.setEvents('compute', retval.resources.compute.total);
      await sails.helpers.setEvents('instances', retval.instances);
      await sails.helpers.setEvents('services', retval.services);
      await sails.helpers.setEvents('apps', retval.apps);
      // Display the results
      if(inputs.mode === 'json') {
        // Return json
        return exits.json(retval);
      }
      else {
        // Display the welcome view.
        return exits.success(retval);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

