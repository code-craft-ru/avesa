'use strict';

var config = require('../config')(),
    funcs = require('./functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true});

function forReturn(callback) {
    funcs.log('Compressing the images');

    return gulp.src(config.dev + '/' + config.imagesFolder +'/**/*.*')
        .pipe(gPlugins.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [
                {cleanupIDs: false}
            ]
        }))
        .pipe(
            gulp.dest(config.dev + '/' + config.imagesFolder)
        );

}

module.exports = forReturn;