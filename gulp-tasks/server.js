'use strict';

var config = require('../config')(),
    funcs =  require('./functions'),
    gulp = require('gulp'),
    gPlugins  = require('gulp-load-plugins')({lazy: true});

function forReturn(){
    funcs.log('Starting server');
    return gPlugins.connectPhp.server(
        config.PHPServerOptions
    )
}

module.exports = forReturn;