/**/// Description: Say hello to the bot
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = '.props';
exports.listed = false;
exports.script = function(deathbot, text, uname) {
  deathbot.respond('.me gives '+uname+' an epic handjob.');
}