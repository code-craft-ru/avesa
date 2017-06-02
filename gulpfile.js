var config = require('./config')(),
    funcs = require('./gulp-tasks/functions'),
    gulp = require('gulp'),
    gPlugins = require('gulp-load-plugins')({lazy: true}),
    browserSync = require('browser-sync').create();

gulp.task('styles', function (callback) {
    var taskStyles = require('./gulp-tasks/styles');

    return taskStyles(browserSync);
    //callback();
});

gulp.task('images', function (callback) {
    var taskIconImages = require('./gulp-tasks/images');

    return taskIconImages();
});


gulp.task('scripts', function (callback) {
    var taskScripts = require('./gulp-tasks/scripts');

    return taskScripts();
});

gulp.task('scripts:build', function (callback) {
    var taskScripts = require('./gulp-tasks/scripts');

    return taskScripts(true);
});

gulp.task('iconfont', function (callback) {
    var taskIconFonts = require('./gulp-tasks/iconfonts');

    return taskIconFonts();
});

gulp.task('start-server', function (callback) {
    var taskServer = require('./gulp-tasks/server');

    return taskServer();
});


gulp.task('bowerUpdate', function (callback) {
    var taskBowerUpadte = require('./gulp-tasks/bowerUpdate');

    return taskBowerUpadte();
});


gulp.task('serve', gulp.parallel('start-server', 'styles', 'scripts', function () {
    var taskServe = require('./gulp-tasks/serve');

    taskServe(browserSync);
}));


gulp.task('clean-prod', function (callback) {
    funcs.clean(
        config.prod + '**/*'
    );
    callback();
});

gulp.task('build-copy', function (callback) {
    var taskBuildCopy = require('./gulp-tasks/build-copy');

    taskBuildCopy();
    callback();
});


gulp.task('build', gulp.series(
    gulp.parallel('clean-prod', 'bowerUpdate'),
    gulp.parallel('styles', 'scripts:build'),
    'build-copy'
));


