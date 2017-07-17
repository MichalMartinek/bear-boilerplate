/**
 * Created by mi on 17.7.17.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var webpackStream = require('webpack-stream');
var webpack2 = require('webpack');

gulp.task('sass', function () {
  return gulp.src('styles/*.scss')
    .pipe(sass({outputStyle: 'compressed', sourceComments: 'map'}, {errLogToConsole: true}))
    .pipe(prefix("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
    .pipe(gulp.dest('public/css'))
    .pipe(reload({stream:true}));
});

gulp.task('client', function() {
  return gulp.src('client/entry.js')
    .pipe(webpackStream({
      output: {
        filename: 'app.bundle.js',
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }]
      }
      }, webpack2))
    .pipe(gulp.dest('public/client/'));
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:5000"
  });
});



gulp.task('start', ['sass', 'client', 'browser-sync'], function () {
  gulp.watch("styles/**/*.scss", ['sass']);
  gulp.watch("client/**/*.js", ['client']);
  gulp.watch(["public/client/**/*.js", "views/**/*.hbs"], reload);
});


gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({script: 'app.js'}).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  });
});