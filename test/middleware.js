const { MiddlewareBeforeInterface } = require("../src/index");

module.exports = class Middleware extends MiddlewareBeforeInterface {
  constructor() {
    super();
  }
  handle(cmd, data, next) {
    return true;
  }
}