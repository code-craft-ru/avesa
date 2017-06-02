'use strict';

var config = require('../config')(),
    funcs = require('./functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true});

function forReturn() {
    funcs.log('Copying production files.');

    // Copy images
    gulp.src(config.dev + '/' + config.imagesFolder + '/**/*')
        .pipe( gulp.dest(config.prod + '/' + config.imagesFolder + '/'));

    // Copy html/php
    gulp.src(config.allhtml)
        .pipe( gulp.dest(config.prod + '_html/'));


    // Copy css
    gulp.src(config.dev + '/' + config.cssFolder + '/**/*.css')
        .pipe( gPlugins.cleanCss() )
        .pipe( gulp.dest(config.prod + '/' + config.cssFolder + '/'));

    // Copy and creating files from areas
    gulp.src(config.allhtml)
        .pipe(gPlugins.useref({
            searchPath: [config.dev, config.dev + config.cssFolder ]
        }))
        .pipe(gPlugins.if('*.css',
            gPlugins.cleanCss({keepSpecialComments : false})
        ))
        .pipe(gulp.dest( config.prod + '_html' ));

    // Copy fonts
    gulp.src(config.dev + '/' + config.fontsFolder + '/**/*')
        .pipe( gulp.dest(config.prod + '/' + config.fontsFolder + '/'));

    // Copy scripts
    gulp.src(config.dev + '/' + config.scriptsFolder + '/**/*')
        .pipe( gulp.dest(config.prod + '/' + config.scriptsFolder + '/'));

    // Copy /*.html
    gulp.src(config.dev + '*.html')
        .pipe( gulp.dest(config.prod));

    return;
}

module.exports = forReturn;