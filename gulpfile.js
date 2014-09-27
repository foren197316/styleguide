"use strict";

var gulp = require("gulp"),
    $ = require("gulp-load-plugins")(),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    runSequence = require("run-sequence"),
    argv = require("yargs").argv,
    del = require("del");

gulp.task("vendors", function() {
  gulp.src([
      "bower_components/jquery/dist/jquery.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/button.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js",
      "bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js"
    ])
    .pipe($.concat("vendors.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("fonts", function() {
  gulp.src([
      "bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*",
      "src/fonts/*"
    ])
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("images", function() {
  gulp.src(["src/images/*"])
    .pipe(gulp.dest("build/images"));
});

gulp.task("styles", function() {
  return gulp.src("src/css/interexchange.scss")
    .pipe($.rubySass())
      .on("error", $.notify.onError(function (error) {
         console.log(error.message);
         if (!argv.production) {
           return "Message to the notifier: " + error.message;
         }
      }))
    .pipe($.autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("scripts", function() {
  return gulp.src("src/js/*.js")
    .pipe($.concat("interexchange.js"))
    .pipe(gulp.dest("build/js"))
});

gulp.task("jshint", function () {
  return gulp.src("build/js/*js")
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish"))
    .pipe($.if(!browserSync.active, $.jshint.reporter("fail")));
});

gulp.task("styleguide", function () {
  return gulp.src("hologram_config.yml")
    .pipe($.hologram());
});

gulp.task("build", ["vendors", "fonts", "images", "styles", "scripts", "styleguide"]);

gulp.task("serve", ["build"], function () {
  browserSync({
    server: {
      baseDir: ["build"],
    },
    open: false
  });
  gulp.watch(["**/*.html"], reload);
  gulp.watch(["src/css/**/*.scss", "src/js/**/*.js"], function() {
    runSequence("build", reload);
  });
});

gulp.task("deploy", function () {
  gulp.src("build/**/*")
    .pipe($.ghPages());
});
