'use strict';

var config = require('../config')(),
    funcs = require('./functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true}),
    fontName = config.iconicFontName;

function forReturn() {
    funcs.log('Creating svg-font');

    return gulp.src([
            config.dev + '/' + config.fontsFolder + '/svg/*.svg'
        ])
        .pipe(gPlugins.iconfontCss({
            fontName: fontName,
            // При использовании файла формата SASS у шрифта возникали некоторые проблемы отображения
            path: config.dev + 'styles/fonts/iconfont-template.scss',
            targetPath: '../styles/fonts/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconic'
        }))
        .pipe(gPlugins.iconfont({
            fontName: fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            startUnicode: true,
            prependUnicode: true,
            normalize: true,
            fontHeight: 1001,
            centerHorizontally: true
        })).pipe(
            gulp.dest(
                config.dev + '/' + config.fontsFolder
            )
        );
}

module.exports = forReturn;