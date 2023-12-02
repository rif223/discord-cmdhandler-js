class MiddlewareBeforeInterface {
  constructor() {
  }
  handle(cmd, data, next) {
    throw Error("handle(command, data, next) must be implemented!");
  }
}

class MiddlewareAfterInterface {
  constructor() {
  }
  handle(cmd, data) {
    throw Error("handle(command, data) must be implemented!");
  }
}

module.exports = {
  MiddlewareBeforeInterface,
  MiddlewareAfterInterface
}