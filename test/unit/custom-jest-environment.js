// https://github.com/facebook/jest/issues/6248
const JSDOMEnvironment = require("jest-environment-jsdom");

class MyEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint32Array: Uint32Array,
          Uint16Array: Uint16Array,
          Uint8Array: Uint8Array,
          ArrayBuffer: ArrayBuffer,
        }),
      })
    );
  }

  async setup() {}

  async teardown() {}
}

module.exports = MyEnvironment;
