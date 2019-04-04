const Pushover  = require( 'pushover-notifications');

var msg = {
    sound: 'spacealarm',
    priority: 1
};

class PushoverNotifications {
    constructor(config) {
        this.pushover = new Pushover({
            token: config.token,
            user: config.user
        });
    }

    async notify(title, message) {
        return new Promise((resolve, reject) => {
            this.pushover.send({...msg, title, message}, function( err, result ) {
                return err ? reject(err) : resolve(result);
            });
        });
    }
}

module.exports = PushoverNotifications;
