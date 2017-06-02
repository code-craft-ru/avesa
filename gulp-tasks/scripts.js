'use strict';

var config = require('../config')(),
    funcs = require('./functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true}),
    vNamed = require('vinyl-named'),
    BowerWebpackPlugin = require("bower-webpack-plugin"),
    webpackStream = require('webpack-stream'),
    webpack = webpackStream.webpack,
    webpackOptions;

function forReturn(isProd, callback) {
    funcs.log('Scripts task');

    var firstBuildReady = false;

    webpackOptions = {
        watch: !isProd,
        devtool: isProd ? false : 'source-map',
        output: {
            publicPath: isProd ?
            '/' + config.scriptsFolder + '/' :
            '../' + config.scriptsFolder + '/'
        },
        filename: "[name].js",
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel',
                exclude: /(bower_components)/, // за работу с боуером отвечает плагин
                query: {
                    presets: ['es2015'],
                    compact: false
                }

            }]
        },
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'commonChunks'
            }),
            new BowerWebpackPlugin({
                modulesDirectories: ["bower_components"],
                manifestFiles: "bower.json",
                includes: /\.js$/,
                excludes: [],
                searchResolveModulesDirectories: true
            }),
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'jQuery': 'jquery'
            })
        ]
    };

    /*function done(err, stats) {
     firstBuildReady = true;
     if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
     funcs.log('on error from done()');
     return;  // emit('error', err) in webpack-stream
     }
     }*/

    if (isProd) {
        webpackOptions.plugins.push(new webpack.optimize.UglifyJsPlugin());

        //gulp.src( config.dev + config.scriptsSourceFolder + '/plugins/**/*.js')
        //    .pipe( gulp.dest(
        //        config.dev + config.scriptsFolder + '/plugins/'
        //    ));

        //gulp.src( config.dev + config.scriptsSourceFolder + '/modules/**/*.js')
        //    .pipe( gulp.dest(
        //        config.dev + config.scriptsFolder + '/modules/'
        //    ));


        gulp.src([
                config.dev + config.scriptsSourceFolder + '/config.js'
            ])
            .pipe(gulp.dest(
                config.dev + config.scriptsFolder + '/'
            ));

    }


    return gulp.src(config.scriptsEntries)
        .pipe(gPlugins.plumber({
            errorHandler: function (error) {
                funcs.log('Webpack: ' + error.message);
                if (isProd) {
                    this.emit('end');
                }
            }
        }))
        .pipe(vNamed())
        .pipe(
            webpackStream(webpackOptions)
        )
        .pipe(gulp.dest(
            config.dev + '/' + config.scriptsFolder + '/'
        ))
        .on('data', function () {
            if (firstBuildReady && isProd) {
                callback();
            }
        });
}

module.exports = forReturn;