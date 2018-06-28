module.exports = class Car {
  constructor(dc, config) {
    this.config = config;
    this.data = {};
    for(let key in config.data) {
      const cvalue = config.data[key];
      switch(cvalue.type) {
        case 'boolean':
          this.data[key] = cvalue.default;
          break;
        case 'number':
          const nrange =  cvalue.max - cvalue.min;
          const nvalue = cvalue.min + (Math.random() * nrange);
          this.data[key] = nvalue;
          break;
        case 'enum':
          const erange =  cvalue.values.length;
          const evalue =  Math.floor(Math.random() * erange);
          this.data[key] = cvalue.values[evalue];
          break;
      }
    }
    dc.sendAdd(this);
  }
  generateData() {
    for(let key in this.config.data) {
      const cvalue = this.config.data[key];
      // calculate the probability that the value will change.
      // Take the change variable 1= 100%, 0 = never
      // Compare it to a randomly gernated number. And see if changes.
      const changed = Math.random();
      if (cvalue.change > changed) {
        // Now determine how much it can change. based on the type.
        switch (cvalue.type) {
          case 'boolean':
            if(this.data[key]) {
              this.data[key] == false;
            }
            else {
              this.data[key] == true;
            }
            break;
          case 'number':
            // Should be able to move negative and positively equally
            // random number goes between 0 and 1 so substract 0.5.
            // multiple by the step value in the config.
            const delta = (Math.random() - 0.5000) * cvalue.step;
            // Now check if the value is greater than max or less than min.
            this.data[key] += delta;
            if(this.data[key] > cvalue.max) {
              // The max has been blown out so we need to go below it.
              // We substract the delta from the max twice once for adding it above and once for randomness.
              this.data[key] -= 2*delta;
            }
            else if(this.data[key] < cvalue.min) {
              // if hit the min then add the change to the value by 2x.
              // this is negative because it dropped below the min because the original value was negative.
              // We are basically anding the delta in a positive manner back.
              this.data[key] -= 2*delta;
            }
            break;
          case 'enum':
            // Pick a random value in the enumeration.
            const erange = cvalue.values.length;
            const evalue = Math.floor(Math.random() * erange);
            this.data[key] = cvalue.values[evalue];
            break;
        }
      }
    }
    return this;
  }
};
