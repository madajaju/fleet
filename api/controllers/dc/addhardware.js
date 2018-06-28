
module.exports = {
  friendlyName: 'dc addhardware',
  description: 'Add Hardware to the Data Center based on yaml file',
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
      viewTemplatePath: 'welcome'
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
      let hw = this.req.body.hardware;
      for(name in hw) {
        let item = hw[name];
        item.name = name;
        item.available = item.capacity;
        item.disabled = false;
        let hardware = await Hardware.create(item).fetch();
        sails.sockets.broadcast('fleet', 'hardware', hardware);
      }
      return exits.json("Ok");
    }
    catch (e) {
      console.error("Failed");
      return exits.error(e);
    }
  }
};

