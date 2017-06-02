'use strict';

var gPlugins  = require('gulp-load-plugins')({lazy: true}),
    npmDelete = require('del'),
    forReturn;

/* Functions */

function clean(path, done) {
    log('Cleaning: ' + gPlugins.util.colors.blue(path));
    npmDelete(path, done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gPlugins.util.log(gPlugins.util.colors.blue(msg[item]));
            }
        }
    } else {
        gPlugins.util.log(
            gPlugins.util.colors.blue(msg)
        );
    }
}


/* Define exports */

forReturn = {
    log: log,
    clean: clean
};

module.exports = forReturn;