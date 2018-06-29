module.exports = {


  friendlyName: 'Add Application',


  description: 'Add Application',


  inputs: {
    application: {
      description: 'application description',
      type: 'json',
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
    notEnoughHardware: {
      description: 'Not enough resources available'
    }
  },


  fn: async function (inputs, exits) {

    // All done.
    try {
      let data = inputs.application;
      // Create the app first.
      let app = await Application.create({name: data.name}).fetch();
      sails.sockets.broadcast('fleet', 'app', app);

      // Now create the resources in the cloud for the application.
      for (let type in data.resources) {
        for (let name in data.resources[type]) {
          await sails.helpers.selectResource.with({type: type, name: name, amount: data.resources[type][name]});
        }
      }

      for (let name in data.services) {
        let service = data.services[name];
        // findOrCreate the Service. this will help with re-usability if needed
        let serv = await Service.findOrCreate({name: name}, {name: name});
        await Service.addToCollection(serv.id, 'apps', app.id);
        await Application.addToCollection(app.id, 'services', serv.id);

        // Allocate Resources if needed.
        let storage = null;
        let network = null;
        if (service.storage) {
          storage = await sails.helpers.selectResource.with({name: service.storage, type: 'storage'});

        }
        if (service.network) {
          network = await sails.helpers.selectResource.with({name: service.network, type: 'network'});
        }

        // Ok now add the Service Instances.
        if (!service.replicas) {
          service.replicas = 1;
        }
        let uinstances = [];
        for (let si = 0; si < service.replicas; si++) {
          // Connect the Service Instance to resources.
          let instance = await ServiceInstance.create({name: name + si, service: serv.id, sid: si}).fetch();
          let ir = await sails.helpers.selectResource.with({type: 'compute', amount: 1});
          await CloudResource.addToCollection(ir.id, 'instances', instance.id);
          let resources = [ir.id];
          if (network) {
            resources.push(network.id);
          }
          if (storage) {
            resources.push(storage.id);
          }
          await ServiceInstance.addToCollection(instance.id, 'resources', resources);
          instance = await ServiceInstance.findOne(instance.id).populateAll();
          uinstances.push(instance);
        }
        sails.sockets.broadcast('fleet', 'instance',uinstances);
        // Load the Service again and broadcast change.
        serv = await Service.findOne(serv.id).populateAll();
        sails.sockets.broadcast('fleet', 'service', serv);
      }
      // now connect the links that all of the services have been created.
      for (let name in data.services) {
        let service = data.services[name];
        let serv = await Service.findOne({name: name});
        if(service.hasOwnProperty('links')) {
          var linkIDs = [];
          for (let i=0; i < service.links.length; i++) {
            let link = service.links[i]
            link = await Service.findOne({name:link});
            linkIDs.push(link.id);
          }
          if(linkIDs.length > 0) {
            await Service.addToCollection(serv.id, 'links', linkIDs);
          }
        }
      }
      return exits.success('Ok');
    }
    catch (e) {
      console.error('Error');
      console.error(e);
      return exits.error(e);
    }
  }
};

