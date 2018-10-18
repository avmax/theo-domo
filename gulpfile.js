const gulp = require('gulp');
const gulpsync = require('gulp-sync')(gulp);
const gulpif = require('gulp-if');
const minCss = require('gulp-cssmin');
const minJs = require('gulp-uglifyjs');
const minHtml = require('gulp-htmlmin');
const minImages = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const fs = require('fs');
const path = require('path');

const env = process.env;

const IS_PROD = env.NODE_ENV === 'prod' || env.NODE_ENV === 'production';

gulp.task('css', () => {
    gulp.src('./src/css/*.css')
        .pipe(gulpif(IS_PROD, minCss()))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
    gulp.src(['./src/js/*.js', '!./src/js/*.min.js'])
        .pipe(gulpif(IS_PROD, minJs()))
        .pipe(gulp.dest('./dist/js'));

    gulp.src(['./src/js/*.min.js'])
        .pipe(gulp.dest('./dist/js'));
 });

 gulp.task('html', () => {
    gulp.src('./src/*.html')
        .pipe(gulpif(IS_PROD, minHtml({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        })))
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', () => {
    gulp.src('./src/images/**/*.*')
        .pipe(gulpif(IS_PROD, minImages()))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('fonts', () => {
    gulp.src('./src/fonts/**/*.*')
      .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('php', () => {
    gulp.src('./src/bat/**/*.*')
      .pipe(gulp.dest('./dist/bat'))
});

gulp.task('copy', () => {
    gulp.src('./src/robots.txt')
      .pipe(gulp.dest('./dist'))
});


gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html",
        },
        browser: "google chrome"
    });
});

gulp.task('reload', () => {
    browserSync.reload();
});


gulp.task('watch', () => {
    gulp.watch('./src/bat/*.*', gulpsync.sync(['php', 'reload']));
    gulp.watch('./src/css/*.css', gulpsync.sync(['css', 'reload']));
    gulp.watch('./src/js/*.js', gulpsync.sync(['js', 'reload']));
    gulp.watch('./src/*.html', gulpsync.sync(['html', 'reload']));
    gulp.watch('./src/images/**/*.*', gulpsync.sync(['images', 'reload']));
    gulp.watch('./src/fonts/**/*.*', gulpsync.sync(['fonts', 'reload']));
});

gulp.task('build', ['css', 'js', 'html', 'php', 'copy', 'images', 'fonts']);
gulp.task('dev', gulpsync.sync(['build', 'server', 'watch']));
