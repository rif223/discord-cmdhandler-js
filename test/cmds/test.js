const { Command } = require("../../src/index");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client)
  }

  get invokes() {
    return ["test", "t", "tt"];
  }

  get description() {
    return "This is a test command!";
  }

  get usage() {
    return ["test"];
  }

  get group() {
    return "TEST";
  }
  
  run(data) {
    console.log(data.args);
  }
  
}