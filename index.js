#!/usr/bin/env node --no-warnings

const config = require("./config");
const Check = require("./check");
const schedule = require('node-schedule');
var program = require('commander');

program
  .version('0.1.0')
  .option('-d, --debug', 'Display debug')
  .parse(process.argv);

const debug = program.debug;

const notifiers = {};
for (let name in config.notifiers) {
    const notifierConfig = config.notifiers[name];
    const TypeClass = require('./notifications/' + notifierConfig.type);

    notifiers[name] = new TypeClass(notifierConfig);
}

const checks = config.checks;

checks.map(checkConfiguration => {
    const check = new Check(checkConfiguration, notifiers, debug);
    schedule.scheduleJob(check.getRule(), async () => {
        if (debug) {
            console.log("Check ", check.getName());
        }
        
        await check.execute();
    });
});