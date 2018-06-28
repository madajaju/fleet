module.exports = {

  friendlyName: 'trigger list',

  description: ' Add description ',

  inputs: {
    mode: {
      description: "results format: json or html",
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

    if (this.req.isSocket) {
      sails.sockets.join(this.req, 'fleet');
    }

    try {
      let triggers = await Trigger.find().populateAll();
      if(inputs.mode == "json"){
        return exits.json(triggers);
      }
      else {
        return exits.success(triggers);
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

