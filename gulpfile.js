'use strict';

var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    _if         = require('gulp-if'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    consolidate = require('gulp-consolidate'),
    deploy      = require('gulp-gh-pages'),
    flow        = require('gulp-flowtype'),
    hologram    = require('gulp-hologram'),
    iconfont    = require('gulp-iconfont'),
    jshint      = require('gulp-jshint'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    rev         = require('gulp-rev'),
    manifest    = require('gulp-rev-rails-manifest'),
    sass        = require('gulp-sass'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    webpack     = require("gulp-webpack-build"),
    WebpackDevServer = require("webpack-dev-server");

gulp.task('font-awesome-interexchange', function() {
  return gulp.src(['src/vectors/*.svg'])
    .pipe(iconfont({ fontName: 'font-awesome-interexchange' }))
    .on('codepoints', function(codepoints, options) {
      gulp.src('src/templates/font-awesome-interexchange.scss')
        .pipe(consolidate('lodash', {
          glyphs: codepoints,
          fontName: 'font-awesome-interexchange',
          fontPath: '../fonts/',
          className: 'fa-iex'
        }))
        .pipe(gulp.dest('src/scss/'));
    })
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('fonts', ['font-awesome-interexchange'], function() {
  return gulp.src([
    'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
    'bower_components/components-font-awesome/fonts/*'
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
    'src/scss/interexchange.scss',
    'src/scss/font-awesome-interexchange.scss'
  ])
  .pipe(sass({keepSpecialComments: 0}))
  .pipe(concat('interexchange.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(minifyCSS())
  .pipe(rename('interexchange.min.css'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('styles-app', function() {
  return gulp.src(['src/scss/app/*.scss'])
    .pipe(sass({keepSpecialComments: 0}))
    .pipe(concat('interexchange-app.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(minifyCSS())
    .pipe(rename('interexchange-app.min.css'))
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

gulp.task('javascript-components', function () {
  return gulp.src('./webpack.config.js')
    .pipe(webpack.watch({watch: true}, function (stream) {
      runSequence('jshint', 'rev');
    }));
});

gulp.task('javascript-development', function() {
  return gulp.src(['src/js/development.js'])
    .pipe(sourcemaps.init({debug: true}))
    .pipe(uglify())
    .pipe(concat('interexchange-development.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint', function () {
  return gulp.src(['src/js/components/*.js', 'src/js/stores/*.js', 'src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('flow', function () {
  return gulp.src(['src/js/main.js'])
    .pipe(flow({all: false, weak: false, killFlow: true, beep: true}));
});

gulp.task('styleguide', function () {
  return gulp.src(['hologram_config.yml'])
    .pipe(hologram());
});

gulp.task('rev-clean', function () {
  return gulp.src(['dist/css/**/*.css', 'dist/js/**/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('rev', ['rev-clean'], function() {
  return gulp.src(['build/**/*.min.css', 'build/**/*.min.js'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(manifest({path: 'manifest.json'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['styles', 'styles-app', 'javascript', 'javascript-development', 'javascript-components', 'jshint', 'rev', 'json', 'images', 'fonts', 'styleguide'], function () {
  browserSync({server: {baseDir: ['build', 'dist']}, open: false});

  gulp.watch(['src/**/*.scss'], function() { runSequence('styles', 'styles-app', 'rev'); });
  gulp.watch(['src/js/development.js'], function() { runSequence('javascript-development', 'jshint', 'rev'); });
  gulp.watch(['src/**/*.json'], function() { runSequence('json'); });
  gulp.watch(['src/images/*'], function() { runSequence('images'); });
  gulp.watch(['src/vectors/*.svg'], function() { runSequence('fonts'); });
});
