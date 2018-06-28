/**
 * Car.js
 *
 * A car that is being simulated
 */

module.exports = {

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    vin: {
      type: 'string',
      required: true,
      unique: true
    },
    config: {
      type: 'json',
      required: false
    }
  },
};
