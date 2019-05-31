// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node');

class TestEnvironment extends NodeEnvironment {
  // constructor(config) {
  //   super(config);
  // }

  async setup() {
    await super.setup();
    this.global.db = 'SuperBD';
  }

  async teardown() {
    this.global.db = null;
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = TestEnvironment;
