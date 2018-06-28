module.exports = {

  friendlyName: 'resource remove',

  description: ' Add description ',

  inputs: {
    id: {
      description: "Remove resource with ID",
      type: 'string',
      required: false
    },
    name: {
      description: "Remove resource with Name",
      type: 'string',
      required: false
    },
    type: {
      description: "Remove resource with Type (amount req1uired)",
      type: 'string',
      required: false
    },
    amount: {
      description: "Remove amount of resource (type required) default is 1",
      type: 'number',
      required: false,
    },
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
      console.log("Remove Resource:", inputs);
      let resource = null;
      if(inputs.id) {
        resource = await CloudResource.findOne({id:inputs.id}).populateAll();
        if(!resource) {
          return exits.notFound(inputs);
        }
      }
      else if(inputs.name) {
        resource = await CloudResource.findOne({name:inputs.name}).populateAll();
        console.log("Resource1:", resource);
        if(!resource) {
          return exits.notFound(inputs);
        }
      }
      else if(inputs.type) {
        if (!inputs.amount) {
          inputs.amount = 1;
        }
        resource = await CloudResource.findOne({type: inputs.type, disabled: false}).populateAll();
        if (!resource) {
          return exits.notFound(inputs);
        }
        resource = resource[0];
      }
      else {
        return exits.notFound(inputs);
      }
      console.log('Resource:', resource);
      await CloudResource.update({id:resource.id}, {disabled:true});
      // Move all of the instances to another piece of hardware
      if(resource.instances.length > 0) {
        await sails.helpers.moveInstances.with({instances: resource.instances});
      }
      // Now remove the hardware.
      resource = await CloudResource.destroy({id:resource.id}).fetch();
      sails.sockets.broadcast('fleet', 'resource-destroy', resource);
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json(inputs);
      }
      else {
        // Display the welcome view.
        return exits.success(inputs);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

