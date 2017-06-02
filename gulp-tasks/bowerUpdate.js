'use strict';

var config = require('../config')(),
    funcs =  require('./functions'),
    gulp = require('gulp'),
    gPlugins  = require('gulp-load-plugins')({lazy: true});

function forReturn(){
    funcs.log('Inject bower components into:' +
        gPlugins.util.colors.yellow(config.baseHtml) + ' folder');

    var options = config.wiredepOptions;
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.injectInput)
        .pipe(wiredep(options))
        /*.pipe(gPlugins.inject(gulp.src(config.js, {read: false}), {
         ignorePath: '../',
         addRootSlash: false,
         relative: true
         }))*/
        .pipe(gulp.dest(config.baseHtml));
}

module.exports = forReturn;