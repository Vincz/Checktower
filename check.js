const _ = require("lodash");
const axios = require("axios");
const schedule = require('node-schedule');
const Context = require('./context');

class Check {
    constructor(config, notifiers, debug = false) {
        this.name = config.name;
        this.config = config;
        this.notifiers = notifiers;
        this.context = new Context(config.historySize || 100);
        this.debug = debug;
    }

    getName() {
        return this.name;
    }

    getRule() {
        var rule = new schedule.RecurrenceRule();
        for(let prop in this.config.every) {
            rule[prop] = this.config.every[prop];
        }

        return rule;
    }

    async execute() {
        try {
            const ctx = await this.config.execute(axios, this.context, this.notify.bind(this));
            this.context.add(ctx);
        } catch(e) {
            console.error(e);
        }
    }

    async notify(notifiersList, title, message) {
        let notifiers = [];
        
        if (_.isString(notifiersList)) {
            notifiers = notifiersList == '*' ? _.keys(this.notifiers) : [notifiersList];
        } else if (_.isArray(notifiersList)) {
            notifiers = notifiersList;
        } else {
            throw new Error(`Invalid call to notify(), the first argument, notifier, must be a string or an array of string`);
        }

        for (let notifier of notifiers) {
            if (!this.notifiers[notifier]) {
                throw new Error(`Invalid notifier "${notifier}" for check "${this.name}"`);
            }
            if (this.debug) {
                console.log(`Notify ${notifier} with ${title}`);
            }
            await this.notifiers[notifier].notify(title, message);
        }
    }
}

module.exports = Check;
