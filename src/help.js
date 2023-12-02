const { EmbedBuilder } = require("discord.js");
const Command = require("./command");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client)
  }

  get invokes() {
    return ["help"];
  }

  get description() {
    return "This is a list of all commands!";
  }

  get usage() {
    return ["help", "help <command>"];
  }
  
  run(data) {
    let cmd = data.cmdhandler.cmds[data.args[0]];
    if(cmd) {
      this.sendHelpMsg(data.channel, cmd);
    } else {
      
      let emb = new EmbedBuilder()
      .setColor(this.embedColor)
      .setTitle("Commands")
      
      let cmds = {};
      data.cmdhandler.cmdArray.forEach(c => {
        if(!c.group) return;
        if(!Object.keys(cmds).includes(c.group)) {
          cmds[c.group] = [c];
        } else {
          cmds[c.group].push(c);
        }
      });
      
      Object.keys(cmds).forEach(group => {
        let text = cmds[group].map(c => {
          return `**${c.invokes[0]}** - *${c.description}*`;
        }).join("\n");
        emb.addField(group, text);
      });
      
      data.channel.send({ embeds: [emb] });
    }
  }
  sendHelpMsg(chan, cmd) {
    
    let mainInvoke = cmd.invokes[0];
    let aliases = cmd.invokes.slice(1);
    let emb = new EmbedBuilder()
    .setColor(this.embedColor)
    .addField("Command", mainInvoke)
    .addField("Description", cmd.description)
    .addField("Usage", cmd.usage.join("\n"))
    .addField("Aliases", aliases.join(", ") || "no aliases")
    .addField("Group", cmd.group)
    return chan.send({ embeds: [emb] })
  }
}