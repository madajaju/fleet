const request = require("supertest-as-promised");
const taction = require('../../api/controllers/vehicle/accidents');

describe('Controller vehicle  Test Cases', function () {
  describe('Primary Controller vehicle accidents Test Case', function () {
    // Requires an environment and stack be created first.
    it('Primary Controller vehicle accidents Good Path', function (done) {
      let url = "/vehicle/accidents?";
      let params = [];
      _.each(Object.keys(taction.inputs), function (key) {
        if (key != "mode") {
          params.push(key + "=" + taction.inputs[key].type);
        }
        else {
          params.push("mode=json");
        }
      });
      url += params.join("&");
      request(sails.hooks.http.app)
        .get(url)
        .expect('Content-Type', /json/)
        .end(function (errva, res) {
          if (err) {
            done(err);
          }
          else {
            console.log(res.body);
            done();
          }
        });
    });
  });
});
