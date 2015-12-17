'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');

gulp.task('copy-js-libraries', function () {
    return gulp.src('./public/js/web-agency/jquery-2.1.4.min.js')
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts', ['copy-js-libraries'], function () {
    var b = browserify({
        entries: './public/js/main.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('bandeau.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy-css-fonts', function () {
    return gulp.src('./public/css/web-agency/fonts/*')
        .pipe(gulp.dest('./dist/css/fonts/'));
});

gulp.task('styles', ['copy-css-fonts'], function () {
    var files = [
        './public/css/reset.css',
        './public/css/normalize.css',
        './public/css/web-agency/fonts.css',
        './public/css/web-agency/style.css',
        './public/css/type.css'
    ];
    return gulp.src(files)
        .pipe(concat('bandeau.css'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(cssmin({ compatibility: 'ie8' }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('images', function () {
    var files = [
        './public/img/web-agency/*',
        './public/img/favicon.ico',
        './public/img/spinner.gif'
    ];
    return gulp.src(files)
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('watch', function () {
    gulp.watch('./public/js/**/*.js', ['scripts']);
    gulp.watch('./public/css/**/*.css', ['styles']);
});

gulp.task('demon', function () {
    nodemon({
        script: 'server.js',
        extension: 'js html'
    })
        .on('change', ['watch'])
        .on('restart', function () {
            console.log('Node server.js restarted!');
        });
});

gulp.task('default', ['scripts', 'styles', 'images']);
gulp.task('default-dev', ['demon', 'watch', 'images']);