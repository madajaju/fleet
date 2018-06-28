const exec = require('child_process').exec;
const taction = require('../../controllers/instance/destroy');

describe('instance destroy Script Test Cases', function () {
  describe('Primary instance destroy Test Case', function () {
    it('Primary instance destroy Good Path', function (done) {
      // var command = exec('bash -c ls -latr', {shell: 'C:\\Users\\dwpulsip\\tools\\Git\\bash.exe'}, function (err, stdout, stderr) {
      let command = "bin/fleet-instance-destroy ";
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
