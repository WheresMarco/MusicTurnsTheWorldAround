var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var reload = browserSync.reload;

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

/*
  Error handler
*/
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

/*
  Styles Task
*/
gulp.task('styles', function() {
  gulp.src('assets/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('assets/css/'))
    .pipe(reload({stream:true}));
});

/*
  Scripts Task
*/
gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

/*
  Build script function
*/
function buildScript(file, watch) {
  var props = {
    entries: ['./assets/js/' + file],
    debug : true,
    transform:  [babelify.configure({stage : 0 })]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('assets/js/min/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('default', ['styles','scripts','browser-sync'], function() {
  gulp.watch('assets/sass/*', ['styles']); // gulp watch for sass changes
  return buildScript('main.js', true); // browserify watch for JS changes
});
