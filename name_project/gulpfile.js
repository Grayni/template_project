"use strict";
// gulp config from Grayni

// for using create tree:
  //   [app]
  //    [css]
  //    [fonts]
  //    [img]
  //    [js]
  //     custom.js    // you create func
  //     libs.js      // gulp-rigger import libs
  //    [libs]        // dir bower libs
  //    [sass]
  //     libs.sass    // @import sass,scss,css
  //     custom.sass  // you create sass
  //    index.php     // or .html

// commands:
  // gulp      => server for develop work (faster) (folder 'app')
  // gulp dist => server for control final result
  // gulp save => easy save app in dist
  // gulp clch => clear cache

/*
     Description:  
     Build gulpfile.js for development sites with use
     different libs and frameworks.
     Functions: convert, unites, minify (sass,css,scss in css), js, move in dist-dir.
     Have two browser-servers.

     Important:
     Need install `lamp or other local server`.
     Then first 'domain' must input in [app] - root-dir.
     Second 'domain' must input in [dist] - root-dir.
     In hosts-file write domains (mysite,dist) on 127.0.0.1
     or change variables (localhost, localhost2) on your domains and
     change ways root-dir ([app],[dist]). 
     Do not forget install missing pakages-gulp.
*/

var
  gulp          = require('gulp'),
  sass          = require('gulp-sass'),
  browserSync   = require('browser-sync').create(),
  browserSync2  = require('browser-sync').create(),
  concat        = require('gulp-concat'),
  uglifyjs      = require('gulp-uglifyjs'),
  cssnano       = require('gulp-cssnano'),
  rename        = require('gulp-rename'),
  del           = require('del'),
  replace       = require('gulp-replace'),
  plugin        = require('gulp-load-plugins')(),
  cache         = require('gulp-cache'),
  autoprefixer  = require('gulp-autoprefixer'),
  rigger        = require('gulp-rigger'),
  plumber       = require('gulp-plumber'),
  //uncss         = require('gulp-uncss'),
  strip         = require('gulp-strip-code');
  plugin.imagemin.pngquant  = require('imagemin-pngquant');
  plugin.imagemin.mozjpeg   = require('imagemin-mozjpeg');


var localhost = '', localhost2 = 'dist';

/* app */

// php-server
// setting server for dir 'app'
gulp.task('browserSync', function() {
  browserSync.init({
    proxy: localhost,
    port: 8080,
    notify: false
  });
});

// convert sass in css, units and minify css
gulp.task('sass', function() {
  return gulp.src('app/sass/style.sass')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade:true }))
  .pipe(gulp.dest('app/css'))
  .pipe(plumber())
  .pipe(browserSync.stream());
});

// combine JS
gulp.task('scripts', function() {
  return gulp.src('app/js/libs.js')
  .pipe(rigger())
  .pipe(rename('main.js'))
  .pipe(browserSync.stream())
  .pipe(gulp.dest('app/js'))
  .pipe(plumber());
});

// run SERVER and watch change files dir:'app'
gulp.task('app', ['scripts','sass','browserSync'], function() {
  gulp.watch('app/sass/*.+(sass|scss)', ['sass']);
  gulp.watch('app/js/*.js', ['scripts', browserSync.reload]);
  gulp.watch('app/*.+(html|php)', browserSync.reload);
});



// delete dir 'dist'
gulp.task('clear', function() {
  return del.sync('dist');
});

// minify IMG
gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(plugin.imagemin([
    plugin.imagemin.gifsicle({interlaced: true}),
    plugin.imagemin.jpegtran({progressive: true}),
    plugin.imagemin.mozjpeg({progressive: true}),
    plugin.imagemin.optipng({optimizationLevel: 7}),
    plugin.imagemin.pngquant({quality: '85-100'}),
    plugin.imagemin.svgo({plugins: [{removeViewBox: true}]})
  ])))
  .pipe(gulp.dest('dist/img'));
});


/* build */

// Units and minify js files in one file
gulp.task('min-js',['scripts'] , function() {
  return gulp.src('app/js/main.js')
  .pipe(gulp.dest('dist/js'))
  .pipe(rename('main.min.js'))
  .pipe(uglifyjs())
  .pipe(plumber())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('min-css',['sass'], function() {
  return gulp.src('app/css/style.css')
  .pipe(strip())
  .pipe(gulp.dest('dist/css'))
  .pipe(rename('style.min.css'))
  .pipe(cssnano())
  .pipe(plumber())
  .pipe(gulp.dest('dist/css'));
});

// fix way JS in HTML and end build-process
gulp.task('fixHtml', function() {
  gulp.src(['app/*.+(html|php|txt)','app/.htaccess'])
  .pipe(replace('css/style.css','css/style.min.css'))
  .pipe(replace('js/main.js','js/main.min.js'))
  .pipe(plumber())
  .pipe(gulp.dest('dist'));
});

// add dir /pages/ in dist
gulp.task('pagesPhp', function() {
  gulp.src('app/pages/*.+(html|php)')
  .pipe(gulp.dest('dist/pages'));
});

// add dir /class/ in dist
gulp.task('pagesPhp', function() {
  gulp.src('app/class/*.+(html|php)')
  .pipe(gulp.dest('dist/class'));
});

// build file of project
gulp.task('build',['clear','img','fixHtml','pagesPhp','min-js','min-css'], function() {
  let arr = ['app/fonts/**/*', 'dist/fonts'];
  gulp.src(arr[0])
  .pipe(gulp.dest(arr[1]))
  .pipe(plumber());
});

// save project in 'dist'
gulp.task('save', ['build']);

/*test finish-result*/
// setting server2 for 'dist'
gulp.task('browserSync2', function() {
  browserSync2.init({
    open: 'external',
    host: localhost2,
    proxy: localhost2,
    port: 8080,
    notify: false
  });
});

// run SERVER and watch change files dir:'dist'
gulp.task('dist', ['build','browserSync2'], function() {
  gulp.watch('app/sass/*.+(sass|scss)', ['min-css', browserSync2.reload]);
  gulp.watch('app/css/custom.css', ['min-css', browserSync2.reload]);
  gulp.watch('app/js/*.js', ['min-js', browserSync2.reload]);
  gulp.watch('app/**/*.+(html|php)', ['fixHtml', browserSync2.reload]);
});


/*accessory tasks*/

// anti-cache (if exist cache version)
// add this task in server task
// gulp.task('delVers', function(){
//  gulp.src(['app/*.+(html|php)'])
//    .pipe(replace(/[\?]rev=(.*)[\"]/g, '"'))
//    .pipe(gulp.dest('app'));
// });

gulp.task('clch', function() {
  return cache.clearAll();
});

gulp.task('default',['app']);