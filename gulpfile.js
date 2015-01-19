'use strict';

var gulp        = require('gulp'),
    addsrc      = require('gulp-add-src'),
    argv        = require('yargs').argv,
    concat      = require('gulp-concat'),
    consolidate = require('gulp-consolidate'),
    deploy      = require('gulp-gh-pages'),
    hologram    = require('gulp-hologram'),
    iconfont    = require('gulp-iconfont'),
    _if         = require('gulp-if'),
    jshint      = require('gulp-jshint'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    del         = require('del'),
    sourcemaps  = require('gulp-sourcemaps'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    source      = require('vinyl-source-stream');

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

gulp.task('javascript', function() {
  gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/react/react-with-addons.js',
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
      'bower_components/react-bootstrap/react-bootstrap.js',
      'bower_components/reflux/dist/reflux.js'
    ])
    .pipe(sourcemaps.init({ debug: true }))
      .pipe(uglify())
      .pipe(concat('interexchange.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'))
});

var componentBundler = watchify(browserify({
  entries: './src/js/main.js',
  dest: './build',
  outputName: 'interexchange-components.min.js',
  debug: true,
  fullPaths: false,
  bundleExternal: false,
  external: ['react', 'reflux']
}));

gulp.task('javascript-components', function () {
  return componentBundler
    .plugin('minifyify', {output: 'build/maps/interexchange-components.map.json', map: '../maps/interexchange-components.map.json'})
    .bundle()
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(source('interexchange-components.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('javascript-development', ['javascript'], function() {
  return gulp.src('src/js/development.js')
    .pipe(sourcemaps.init({ debug: true }))
      .pipe(uglify())
      .pipe(concat('interexchange-development.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint', function () {
  return gulp.src([
      'src/js/components/*.js',
      'src/js/stores/*.js',
      'src/js/main.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(_if(!browserSync.active, jshint.reporter('fail')));
});

gulp.task('styleguide', function () {
  return gulp.src('hologram_config.yml')
    .pipe(hologram());
});

gulp.task('build', ['fonts', 'images', 'json', 'styles', 'javascript', 'javascript-development', 'javascript-components', 'styleguide']);

gulp.task('serve', ['build', 'javascript-components'], function () {
  browserSync({
    server: {
      baseDir: ['build'],
    },
    open: false
  });
  gulp.watch(['**/*.html'], reload);
  gulp.watch(['src/scss/**/*.scss', 'src/json/**/*.json', 'src/vectors/*.svg', 'layout/*.html', 'layout/theme/css/**/*.css', 'layout/theme/js/**/*.js'], function() {
    runSequence('build', reload);
  });

  componentBundler.on('update', function () {
    runSequence('javascript-components', 'jshint', reload);
  });
});

gulp.task('deploy', function () {
  return gulp.src('./build/**/*')
    .pipe(deploy({cacheDir: "tmp/build-cache"}));
});
