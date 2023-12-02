const { EmbedBuilder } = require("discord.js");

module.exports = class Command {
  constructor(client) {
    this.client = client;
  }

  get invokes() {
    throw Error("invokes must be implemented!");
  }

  get description() {
    return "no description";
  }

  get usage() {
    return ["no usage"];
  }
  
  get group() {
    return;
  }

  get guildOnly() {
    return false;
  }

  run(data) {
    throw Error("run() must be implemented!");
  }
  
  sendErrorMsg(chan, error) {
    let emb = new EmbedBuilder()
    .setColor(15158332)
    .setTitle("Error")
    .setDescription(error)
    return chan.send({ embeds: [emb] });
  }
}