const Command = require("./command");
const HelpCmd = require("./help");
const { MiddlewareBeforeInterface, MiddlewareAfterInterface } = require("./middlewareInterface");

module.exports = class CmdHandler {
  constructor(client, options = {}) {
    if(!client) throw Error("The client must be set!");
    if(!options.prefix) throw Error("The prefix must be set!");
    
    this.client = client;
    this.fs = require("fs");
    this.prefix = options.prefix;
    this.invokeToLower = options.invokeToLower || true;
    this.getGuildPrefix = options.getGuildPrefix || this._defaultGetGuildPrefix;
    this.guildOnlyError = options.guildOnlyError || this._defaultGuildOnlyError;
    
    this.cmds = {};
    this.cmdArray = [];
    this.middlewaresBefore = [];
    this.middlewaresAfter = [];
    
    client.on("messageCreate", msg => this._messageCreateHandler(msg));
    
  }
  
  _defaultGetGuildPrefix(guildID) {
    return null;
  }
  
  _defaultGuildOnlyError(data) {
    return;
  }
  
  registerDefaultHelpCommand(embedColor) {
    let cmd = new HelpCmd(this.client);
    cmd.embedColor = embedColor || 3447003;
    cmd.invokes.forEach(invoke => {
      this.cmds[invoke] = cmd;
    });
    this.cmdArray.push(cmd);
  }
  
  registerMiddleware(MW) {
    if(!MW) throw Error("The middleware class must be set!");
    if(MW.prototype instanceof MiddlewareBeforeInterface || MW.prototype instanceof MiddlewareAfterInterface) {
      if(MW.prototype instanceof MiddlewareBeforeInterface) {
        let mw = new MW();
        this.middlewaresBefore.push(mw);
      } else if(MW.prototype instanceof MiddlewareAfterInterface) {
        let mw = new MW();
        this.middlewaresAfter.push(mw);
      }
    } else {
      throw Error("The class must be extend the MiddlewareBeforeInterface or MiddlewareAfterInterface class!");
    }
  }
  
  registerMiddlewares(MWArray) {
    MWArray.forEach(MW => {
      this.registerMiddleware(MW);
    });
  }
  
  registerCommand(CmdClass) {
    if(!CmdClass) throw Error("The class must be set!");
    if(CmdClass.prototype instanceof Command) {
      let cmd = new CmdClass(this.client);
      cmd.invokes.forEach(invoke => {
        this.cmds[invoke] = cmd;
      });
      this.cmdArray.push(cmd);
    } else {
      throw Error("The class must be extend the Command class!");
    }
  }
  
  registerCommands(CmdClassArray) {
    CmdClassArray.forEach(CmdClass => {
      this.registerCommand(CmdClass);
    });
  }
  
  registerCommandsIn(path) {
    this.fs.readdir(path, (err, files) => {
      if(err) throw Error(err);
      files.forEach(file => {
        const cmd = require(path + file);
        this.registerCommand(cmd);
      });
    });
  }
  
  _paresArgs(args) {
    let paresedArgs = [];
    args.forEach(arg => {
      if(Number(arg)) {
        paresedArgs.push(Number(arg));
      } else if(arg.toLowerCase() == "true" || arg.toLowerCase() == "false") {
        paresedArgs.push(arg.toLowerCase() == "true");
      } else {
        if(arg == 0) {
          paresedArgs.push(0);
        } else paresedArgs.push(arg);
      }
    });
    return paresedArgs;
  }
  
  _messageCreateHandler(msg) {
    let chan = msg.channel;
    let memb = msg.member;
    let aut = msg.author;
    let g = msg.guild;
    let cont = msg.content;
    
    let prefix = this.prefix;

    if(aut.bot) return;
    
    if(g) {
      let guildPrefix = this.getGuildPrefix(g.id);
      if(guildPrefix && guildPrefix !== null) prefix = guildPrefix;
    }

    // output: -1
    // Warum?
    
    if(cont.indexOf(prefix) !== 0) return console.log(cont.indexOf(prefix));
      
    let args = msg.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift();
    
    if(this.invokeToLower) {
      cmd = cmd.toLowerCase();
    }
    
    let data = {};
    data.message = msg;
    data.channel = chan;
    data.args = this._paresArgs(args);
    data.guild = g;
    data.member = memb;
    data.author = aut;
    data.cmdhandler = this;
    
    if(this.cmds[cmd]) {
      if(this.cmds[cmd].guildOnly && !g) return this.guildOnlyError(data);
      
      let middlewaresBefore = this.middlewaresBefore;
      for(let mw in middlewaresBefore) {
          let next = middlewaresBefore[mw].handle(this.cmds[cmd], data);
          
          if(!next) {
            return;
          }
      }
      
      this.cmds[cmd].run(data);
      
      let middlewaresAfter = this.middlewaresAfter;
      for(let mw in middlewaresAfter) {
          let next = middlewaresAfter[mw].handle(this.cmds[cmd], data);
          
          if(!next) {
            return;
          }
      }
      
    }
  }

}