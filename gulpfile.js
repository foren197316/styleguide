'use strict';

var gulp        = require('gulp'),
    argv        = require('yargs').argv,
    concat      = require('gulp-concat'),
    consolidate = require('gulp-consolidate'),
    deploy      = require('gulp-gh-pages'),
    hologram    = require('gulp-hologram'),
    iconfont    = require('gulp-iconfont'),
    _if         = require('gulp-if'),
    jshit       = require('gulp-jshint'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    react       = require('gulp-react'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    del         = require('del');

var browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    runSequence = require('run-sequence');

gulp.task('font-awesome-interexchange', function() {
  gulp.src(['src/vectors/*.svg'])
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
  gulp.src([
      'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
      'bower_components/components-font-awesome/fonts/*'
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

gulp.task('styles', ['fonts'], function() {
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
  return gulp.src('src/scss/app/*.scss')
        .pipe(sass({keepSpecialComments: 0}))
        .pipe(concat('interexchange-app.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(minifyCSS())
        .pipe(rename('interexchange-app.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('javascript', function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/react/react-with-addons.js',
      'bower_components/react/JSXTransformer.js',
      'bower_components/datejs/build/date.js',
      'bower_components/jquery.serializeJSON/jquery.serializejson.js',
      'bower_components/react-radio-group/react-radiogroup.js',
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
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
      'bower_components/q/q.js',
      'bower_components/react-bootstrap/react-bootstrap.js',
      'bower_components/reflux/dist/reflux.js'
    ])
    .pipe(concat('interexchange.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(uglify())
    .pipe(concat('interexchange.min.js'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('javascript-components', function() {
  return gulp.src('src/jsx/components/*.jsx')
    .pipe(concat('interexchange-components.jsx'))
    .pipe(gulp.dest('build/jsx'))
    .pipe(react())
    .pipe(concat('interexchange-components.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(uglify().on('error', function(e) { console.log('\x07', e); return this.end(); }))
    .pipe(concat('interexchange-components.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('javascript-development', ['javascript'], function() {
  return gulp.src([
      'build/js/interexchange.js',
      'src/js/development.js'
    ])
    .pipe(concat('interexchange-development.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('javascript-app', function() {
  return gulp.src('src/js/app/*.js')
    .pipe(concat('interexchange-app.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(uglify())
    .pipe(concat('interexchange-app.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint', function () {
  return gulp.src('build/js/*js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(_if(!browserSync.active, jshint.reporter('fail')));
});

gulp.task('styleguide', function () {
  return gulp.src('hologram_config.yml')
    .pipe(hologram());
});

gulp.task('build', ['fonts', 'images', 'json', 'styles', 'styles-app', 'javascript', 'javascript-development', 'javascript-components', 'javascript-app', 'styleguide']);

gulp.task('serve', ['build'], function () {
  browserSync({
    server: {
      baseDir: ['build'],
    },
    open: false
  });
  gulp.watch(['**/*.html'], reload);
  gulp.watch(['src/scss/**/*.scss', 'src/js/**/*.js', 'src/json/**/*.json', 'src/jsx/**/*.jsx', 'src/vectors/*.svg', 'layout/*.html', 'layout/theme/css/**/*.css', 'layout/theme/js/**/*.js'], function() {
    runSequence('build', reload);
  });
});

gulp.task('deploy', function () {
  return gulp.src('./build/**/*')
    .pipe(deploy({cacheDir: "tmp/build-cache"}));
});
