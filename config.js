module.exports = function () {
    var dev = 'dev/',
        prod = 'prod/',
        devSassFolder = dev + 'styles/',
        scriptsFolder = 'scripts',
        scriptsSourceFolder = 'scripts_source',
        baseHtml = './' + dev + '_html/base/';

    var config = {
        prod: prod,
        dev: dev,

        allhtml: dev + '_html/**/*.php',
        baseHtml: baseHtml,
        devSassFolder: devSassFolder,
        sass: [
            devSassFolder + '/*.sass',
            devSassFolder + '/*.scss',
            '!' + devSassFolder + '/_*.scss',
            '!' + devSassFolder + '/__*.scss',
            '!' + devSassFolder + '/_*.sass',
            '!' + devSassFolder + '/__*.sass'
        ],
        cssFolder: 'css',
        scriptsSourceFolder: scriptsSourceFolder ,
        scriptsFolder: scriptsFolder ,
        imagesFolder: 'images',
        fontsFolder: 'fonts',
        iconicFontName: 'iconic',

        scriptsEntries: [dev + scriptsSourceFolder + '/bundle.*.*'],

        // scriptsDynamicPath - используется для динамически подгружаемых модулей,
        // для доступа с сервера, т.ч. стоит уточнять у бекендера.
        scriptsDynamicPath: '/' + scriptsSourceFolder + '/',
        injectInput: [
            baseHtml + '/head.php',
            //'./app/_html/base/scripts.php'
        ],
        compassOptions: {
            css: dev + '/css',
            sass: dev + '/styles',
            time: false,
            comments: false,
            sourcemap: false,
            style: 'nested'
        },
        PHPServerOptions: {
            /* Вместо установки статичных параметров указанных ниже,
             * стоит добавить путь к php.exe файлу в PATH переменной операционной системы.
             * Пример статичных параметров:
             * bin: 'D:/wamp/bin/php/php5.5.12/php.exe',
             * ini: 'D:/wamp/bin/php/php5.5.12/php.ini',
             */
            base: './',
            port: 8010,
            keepalive: true,
            stdio: 'ignore' // Закрывает вывод в консоль информацию о загруженных файлах. Если нужно, лучше использовать опции browserSync`а
        },
        browserSyncOptions: {
            notify: false,
            proxy: '127.0.0.1:8010/',
            port: 80,
            open: true,
            logConnections: false,
        },
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            //exclude: ['bower_components/modernizr/modernizr.js'],
            ignorePath: '../'
        }
    };

    config.wiredepOptions =  {
        bowerJson: config.bower.json,
        directory: config.bower.directory,
        //exclude: config.bower.exclude,
        ignorePath: config.bower.ignorePath
    };

    return config;
};
