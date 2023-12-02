const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel, Partials.Message]
});

const { CmdHandler } = require("../src/index");

const cmdhandler = new CmdHandler(client, {
  prefix: "!"
});

cmdhandler.registerMiddleware(require("./middleware"));
cmdhandler.registerDefaultHelpCommand();
cmdhandler.registerCommandsIn(__dirname + "/cmds/");

client.login("1234567890");