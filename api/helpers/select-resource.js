module.exports = {


  friendlyName: 'Select resource',


  description: 'Select a resource in the cloud',


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
      description: 'Name of Resource',
      type: 'number',
      required: false
    }
  },


  exits: {
    success: {
      responseType: 'model',
    },
    notEnoughResource: {
      responseType: 'model',
      description: 'Not enough resources available'
    }
  },


  fn: async function (inputs, exits) {

    if (!inputs.type) { inputs.type = 'compute'; }
    if (!inputs.amount) { inputs.amount = 1; }

    // Find the specific resource. If it does not exist then it should create it.
    let resource = null;
    if (inputs.name) {
      resource = await CloudResource.findOne({name: inputs.name});
      if (!resource) {
        // Create it and do not consume values.
        resource = await sails.helpers.allocateResource.with(inputs);
        return exits.success(resource);
      }
      else {
        if (resource.available >= inputs.amount) {
          resource = await CloudResource.update({id: resource.id}, {available: resource.available - inputs.amount}).fetch();
          return exits.success(resource[0]);
        }
        else {
          console.error('Not EnoughResources1:', inputs);
          console.error('Not EnoughResources2:', inputs.amount);
          console.error('Not EnoughResources3:', resource);
          return exits.notEnoughResource(inputs);
        }
      }
    }
    else {
      // Find a resource that we can use.
      console.log("Find a Resource:");
      let resources = await CloudResource.find({type: inputs.type, disabled: false});
      resources = _.sortBy(resources, 'available').reverse();
      console.log("Checking a Resources:", resources.length);
      let i = 0;
      while (i < resources.length) {
        console.log("Check:", inputs.amount, "<=", resources[i]);
        if (inputs.amount <= resources[i].available) {
          resource = await CloudResource.update({id: resources[i].id}, {available: resources[i].available - inputs.amount}).fetch();
          resource = resource[0];
          console.log("Found a Resource to reuse:");
          break;
        }
        i++;
      }
      // Not enough resources need to create a resource
      if (!resource) {
        console.log("Need to create a resource");
        let amount = inputs.amount;
        if(inputs.type === 'compute') {
          // Containers per VM = 10
          inputs.amount = 2;
        }
        resource = await sails.helpers.allocateResource.with(inputs);
        inputs.amount = amount;

        if (resource.available > inputs.amount) {
          resource = await CloudResource.update({id: resource.id}, {available: resource.available - inputs.amount}).fetch();
          return exits.success(resource[0]);
        }
        else {
          console.error('Not Enough Hardware', resource);
          console.error('Asked for', inputs.amount);
          return exits.notEnoughResource(inputs);
        }
      }
      console.log("Done select Resource");
      return exits.success(resource);
    }
  }
};

