'use strict';

var config = require('../config')(),
    funcs =  require('./functions'),
    gulp = require('gulp'),
    gPlugins  = require('gulp-load-plugins')({lazy: true});

function forReturn(browserSync){
    funcs.log('Compiling Sass --> CSS');

    /*funcs.clean(
        config.dev + config.cssFolder
    );*/

    return gulp.src(config.sass)
        .pipe(gPlugins.plumber({
            errorHandler: function (error) {
                funcs.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(
            gPlugins.compass(config.compassOptions)
        )
        .pipe(gPlugins.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(
            config.dev + '/' + config.cssFolder
        ))
        .pipe(browserSync.stream());
}

module.exports = forReturn;