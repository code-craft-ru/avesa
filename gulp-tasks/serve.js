'use strict';

var config = require('../config')(),
    funcs = require('./functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true});

function forReturn(browserSync) {
    funcs.log('Start Browser Sync to develop and watching for changes in ' +
        gPlugins.util.colors.yellow(config.dev) + ' folder');

    var options = config.browserSyncOptions;

    options.proxy += config.dev;

    funcs.log(options.proxy);
    browserSync.init(options);

    gulp.watch([
        config.allhtml,
        //config.cssFolder,
        config.dev + '/' + config.scriptsFolder + '/**/*.*',
        config.dev + '/' + config.imagesFolder + '/**/*.*'
    ]).on('change', browserSync.reload);

    gulp.watch([config.dev + config.scriptsSourceFolder + '/config.js'])
        .on('change',
            function () {
                gulp.src([
                        config.dev + config.scriptsSourceFolder + '/config.js'
                    ])
                    .pipe(gulp.dest(
                        config.dev + config.scriptsFolder + '/'
                    ));
            });

    gulp.watch(
        config.devSassFolder + '**/*.*',
        gulp.series('styles')
    );

    gulp.watch(
        config.dev + '/' + config.fontsFolder + '/svg/*.svg',
        gulp.series('iconfont')
    );
}

module.exports = forReturn;