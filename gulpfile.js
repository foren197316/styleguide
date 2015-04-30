'use strict';

var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    flow        = require('gulp-flowtype'),
    hologram    = require('gulp-hologram'),
    jshint      = require('gulp-jshint'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    rev         = require('gulp-rev'),
    manifest    = require('gulp-rev-rails-manifest'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    webpack     = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackDevConfig = require(__dirname + '/webpack-development.config.js'),
    webpackProdConfig = require(__dirname + '/webpack-production.config.js');

gulp.task('fonts', function() {
  return gulp.src([
    'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
    'bower_components/components-font-awesome/fonts/*',
    'src/fonts/*'
  ])
  .pipe(gulp.dest('build/fonts'))
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
  return gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('build/images'))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('json', function() {
  return gulp.src(['src/json/**/*'])
    .pipe(gulp.dest('build/json'));
});

gulp.task('styles', function() {
  return gulp.src([
    'src/scss/interexchange.scss'
  ])
  .pipe(sass({keepSpecialComments: 0}))
  .pipe(concat('interexchange.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(minifyCSS())
  .pipe(rename('interexchange.min.css'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('javascript', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery.serializeJSON/jquery.serializejson.js',
    'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/button.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js'
  ])
  .pipe(sourcemaps.init({debug: true}))
  .pipe(uglify())
  .pipe(concat('interexchange.min.js'))
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest('build/js'))
});

gulp.task('javascript-components', ['jshint'], function () {
  var config = webpackProdConfig;
  config.watch = true;
  config.cache = true;
  return webpack(config, function (err) {
    if (err) {
      console.log(err);
    } else {
      gulp.start('manifest');
    }
  });
});

gulp.task('jshint', function () {
  return gulp.src(['src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('flow', function () {
  return gulp.src(['src/js/**/*.js'])
    .pipe(flow({all: false, weak: false, killFlow: true, beep: true}));
});

gulp.task('styleguide', function () {
  return gulp.src(['hologram_config.yml'])
    .pipe(hologram());
});

gulp.task('build-clean', function () {
  return gulp.src(['build/css/**/*.css', 'build/js/**/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('manifest-clean', function () {
  return gulp.src(['dist/css/**/*.css', 'dist/js/**/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('manifest', ['manifest-clean'], function() {
  return gulp.src(['build/**/*.min.css', 'build/**/*.min.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(manifest({path: 'manifest.json'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack-dev-server', function(callback) {
  new WebpackDevServer(webpack(webpackDevConfig), {
    hot: true,
    contentBase: __dirname + '/build',
    publicPath: webpackDevConfig.output.publicPath
  }).listen(3000, 'localhost', function(err) {
    if (err) {
      console.log(err);
    }
  });
});

gulp.task('browser-sync-dist-server', function() {
  return browserSync({
    open: false,
    port: 8080,
    ui: {
      port: 8081
    },
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('serve', ['styles', 'javascript', 'javascript-components', 'json', 'images', 'fonts', 'styleguide'], function () {
  gulp.start('webpack-dev-server');
  gulp.start('browser-sync-dist-server');

  gulp.watch(['build/css/**/*', 'build/fonts/**/*', 'build/images/**/*'], function() { gulp.start('manifest'); });
  gulp.watch(['src/**/*.scss'], function() { runSequence('styles'); });
  gulp.watch(['src/js/**/*.js'], function() { gulp.start('jshint'); });
  gulp.watch(['src/**/*.json'], function() { gulp.start('json'); });
  gulp.watch(['src/images/*'], function() { gulp.start('images'); });
  gulp.watch(['src/vectors/*.svg'], function() { gulp.start('fonts'); });
});

gulp.task('start', ['build-clean'], function () {
  gulp.start('serve');
});
