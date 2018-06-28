module.exports = {

  friendlyName: 'car add',

  description: ' Add description ',

  inputs: {
    vin: {
      description: 'VIN of the car',
      type: 'string',
      required: true
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
      viewTemplatePath: 'car/show'
    },
    json: {
      responseType: '', // with return json
    },
    duplicate: {
      description: 'Duplicate Car',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits, env) {

    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      let car = await Car.findOne({vin: inputs.vin});
      if (car) {
        return exits.duplicate('car/list');
      }
      else {
        console.error("ADD-----------");
        console.error(this.req.body);
        console.error("ENDADD-----------");
        car = await Car.create({vin: inputs.vin, config: this.req.body.data}).fetch();
        // Display the results
        if (inputs.mode === 'json') {
          // Return json
          return exits.json({id:car.id, car: car});
        }
        else {
          // Display the welcome view.
          return exits.success({id:car.id, car: car});
        }
      }
    }
    catch (e) {
      return exits.error(e);
    }
  }
};

