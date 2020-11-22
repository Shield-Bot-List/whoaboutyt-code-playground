/*
MIT License

Copyright (c) 2020 Shield Bot List

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const { default: Collection } = require("@discordjs/collection");
const Discord = require("discord.js");
class CustomClient extends Discord.Client {
  constructor() {
    super({
      disableMentions: `everyone`,
    });
    this.commands = new Discord.Collection();
    this.path = require("path");
    this.events = new Collection();
    this.fs = require("fs");
    this.discord = require("discord.js");
  }

  eventHandler(eventPath) {
    this.fs.readdirSync(this.path.normalize(eventPath)).map((f) => {
      const File = require(this.path.join(__dirname, `..`, eventPath, f));
      this.on(File.name, file.run.bind(null, this));
      this.events.set(File.name, File);
    });
  }

  commandHandler(commandsFolderPath) {
    this.fs.readdirSync(this.path.normalize(commandsFolderPath)).map((data) => {
      const File = require(this.path.join(
        __dirname,
        `..`,
        commandsFolderPath,
        data
      ));

      this.commands.set(File.name, File);

      console.log("Loaded command " + File.name);
    });
  }

  start(token, commandFolder, eventFolder) {
    this.login(token).catch((err) => console.log(err));

    this.commandHandler(commandFolder);

    this.eventHandler(eventFolder);

    console.log("I finished all my processes to start the bot.");
  }
}

module.exports = CustomClient;

new CustomClient().commandHandler("commands");
