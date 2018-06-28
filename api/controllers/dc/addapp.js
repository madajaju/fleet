module.exports = {

  friendlyName: 'dc addapp',

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
      let data = this.req.body.application;
      await sails.helpers.addApplication.with({application:data});
      return exits.json('Ok');
    }
    catch (e) {
      console.error('Failed');
      return exits.error(e);
    }
  }
};

