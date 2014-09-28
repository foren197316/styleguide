'use strict';

var gulp      = require('gulp'),
    $         = require('gulp-load-plugins')(),
    minifyCSS = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    sass      = require('gulp-sass'),
    concat    = require('gulp-concat'),
    argv      = require('yargs').argv,
    del       = require('del');

var browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    runSequence = require('run-sequence');

gulp.task('vendors', function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/react/react.js',
      'bower_components/react/JSXTransformer.js',
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
    .pipe($.concat('interexchange.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('fonts', function() {
  gulp.src([
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
      'bower_components/components-font-awesome/fonts/*',
      'src/fonts/*'
    ])
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('images', function() {
  gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('build/images'));
});

gulp.task('json', function() {
  gulp.src(['src/json/**/*'])
    .pipe(gulp.dest('build/json'));
});

gulp.task('styles', function() {
  return gulp.src('src/scss/interexchange.scss')
        .pipe(sass({keepSpecialComments: 0}))
        .pipe(gulp.dest('css'))
        .pipe(concat('interexchange.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(minifyCSS())
        .pipe(rename('interexchange.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/components/*.js')
    .pipe($.concat('interexchange-components.js'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('jshint', function () {
  return gulp.src('build/js/*js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('styleguide', function () {
  return gulp.src('hologram_config.yml')
    .pipe($.hologram());
});

gulp.task('build', ['vendors', 'fonts', 'images', 'json', 'styles', 'scripts', 'styleguide']);

gulp.task('serve', ['build'], function () {
  browserSync({
    server: {
      baseDir: ['build'],
    },
    open: false
  });
  gulp.watch(['**/*.html'], reload);
  gulp.watch(['src/scss/**/*.scss', 'src/js/**/*.js', 'src/json/**/*.json', 'layout/*.html', 'layout/theme/css/**/*.css', 'layout/theme/js/**/*.js'], function() {
    runSequence('build', reload);
  });
});

gulp.task('deploy', function () {
  gulp.src('build/**/*')
    .pipe($.ghPages());
});
