'use strict';

var gulp        = require('gulp'),
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
    sass        = require('gulp-sass'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
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
    .pipe(gulp.dest('build/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
  gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('build/images'))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('json', function() {
  gulp.src(['src/json/**/*'])
    .pipe(gulp.dest('build/json'));
});

gulp.task('styles', ['fonts'], function() {
  gulp.src([
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
    'bower_components/moment/moment.js',
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

gulp.task('javascript-components', function () {
  browserify({
    fullPaths: false,
    entries: './src/js/main.js',
    dest: './build',
    outputName: 'interexchange-components.min.js',
    debug: true
  })
    .plugin('minifyify', {
      map: '/maps/interexchange-components.min.js.map',
      output: 'build/maps/interexchange-components.min.js.map'
    })
    .bundle()
    .on('error', function (err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(source('interexchange-components.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('javascript-development', ['javascript'], function() {
  gulp.src('src/js/development.js')
    .pipe(sourcemaps.init({ debug: true }))
    .pipe(uglify())
    .pipe(concat('interexchange-development.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('jshint', function () {
  gulp.src([
      'src/js/components/*.js',
      'src/js/stores/*.js',
      'src/js/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('flow', function () {
  return gulp.src([
      'src/js/main.js'
    ])
    .pipe(flow({
      all: false,
      weak: false,
      killFlow: false,
      beep: true,
      abort: false
    }));
});

gulp.task('styleguide', function () {
  gulp.src('hologram_config.yml')
    .pipe(hologram());
});

gulp.task('rev', ['images', 'fonts', 'styles', 'javascript', 'javascript-development', 'javascript-components'], function() {
  gulp.src(['./build/**/*.css', './build/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({path: 'manifest.json'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['fonts', 'images', 'json', 'styles', 'javascript', 'javascript-development', 'javascript-components', 'styleguide']);

gulp.task('serve', ['build', 'rev'], function () {
  browserSync({
    server: {
      baseDir: ['build'],
    },
    open: false
  });
  gulp.watch(['**/*.html'], reload);
  gulp.watch(['src/scss/**/*.scss', 'src/json/**/*.json', 'src/js/**/*.js', 'src/vectors/*.svg', 'layout/*.html', 'layout/theme/css/**/*.css', 'layout/theme/js/**/*.js'], function() {
    runSequence('build', 'jshint', reload);
  });
});

gulp.task('deploy', function () {
  gulp.src('./build/**/*')
    .pipe(deploy({cacheDir: "tmp/build-cache"}));
});
