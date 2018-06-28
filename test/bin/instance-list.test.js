const exec = require('child_process').exec;
const taction = require('../../controllers/instance/list');

describe('instance list Script Test Cases', function () {
  describe('Primary instance list Test Case', function () {
    it('Primary instance list Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bin/fleet-instance-list ";
      let params = [];
      _.each(Object.keys(taction.inputs), function (key) {
        if(key != "mode") {
          params.push("--" + key + " " + taction.inputs[key].type);
        }
      });
      command += params.join(" ");
      let results = exec(command, function (err, stdout, stderr) {
        console.log(stderr);
        if (err) {
          done(err);
        }
        else {
          console.log(stdout);
        }
      });
      results.on('exit', function (code) {
        done(code);
      });
    });
  });
});
