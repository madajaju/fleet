module.exports = {
  friendlyName: 'dc alloc',
  description: ' Add description ',
  inputs: {
    type: {
      description: 'Type of resources required',
      type: 'string',
      required: true
    },
    amount: {
      description: 'Amount of resource to use',
      type: 'number',
      required: false
    },
    replica: {
      description: 'Number of times to allocate the resource',
      type: 'number',
      required: false
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
      viewTemplatePath: '/dc/show'
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

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let resource = await sails.helpers.allocateResource.with(inputs);
      console.log("Resource", resource);
      // Display the results
      if (inputs.mode === 'json') {
        // Return json
        return exits.json("ok");
      }
      else {
        // Display the welcome view.
        return exits.success("ok");
      }
    }
    catch (e) {
      console.error("Error");
      console.error(e);
      return exits.error(e);
    }
  }
};

