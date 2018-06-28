module.exports = {
  friendlyName: 'dc showdynamic',
  description: ' Add description ',
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
      viewTemplatePath: 'dc/showDynamic'
    },
    json: {
      responseType: '', // with return json
    },
  },
  fn: async function (inputs, exits, env) {
    console.log('Made it here');
    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    sails.sockets.join(this.req, 'funSockets');

    sails.sockets.broadcast('funSockets', 'hello', {howdy: 'hi there!'});

    sails.sockets.broadcast('funSockets', 'hello', {howdy: 'hi there!'});

    sails.sockets.broadcast('funSockets', 'hello', {howdy: 'hi there!'});

    return exits.json({ anyData: 'we want to send back' });
  }
};

