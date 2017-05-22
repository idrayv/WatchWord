﻿var gulp = require('gulp'),
    Q = require('q'),
    ts = require('gulp-typescript'),
    less = require('gulp-less'),
    path = require('path'),
    rimraf = require('rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    cfg = require('./app/config');

gulp.task('clean-lib', function (cb) {
    return rimraf('./wwwroot/lib/', cb);
});

gulp.task('clean-app', function (cb) {
    return rimraf('./wwwroot/app/', cb);
});

gulp.task('copy-lib', ['clean-lib'], function () {
    var libs = [
        "@angular",
        "systemjs",
        "core-js",
        "zone.js",
        "rxjs"
    ];

    var promises = [];

    libs.forEach(function (lib) {
        var defer = Q.defer();
        var pipeline = gulp
            .src('node_modules/' + lib + '/**/*')
            .pipe(gulp.dest('./wwwroot/lib/' + lib));

        pipeline.on('end', function () {
            defer.resolve();
        });
        promises.push(defer.promise);
    });

    return Q.all(promises);
});

gulp.task('copy-js', ['clean-app'], function () {
    return gulp.src('app/**/*.js')
        .pipe(gulp.dest('wwwroot/app/'));
});

gulp.task('copy-html', ['copy-js'], function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('wwwroot/app/'));
});

gulp.task('less', ['copy-html'], function () {
    return gulp.src('app/less/**/*.less')
        .pipe(less({
        }))
        .pipe(gulp.dest('wwwroot/css'));
});

gulp.task('copy-ts', ['clean-app'], function () {
    return gulp.src('app/**/*.ts')
        .pipe(gulp.dest('wwwroot/app/'));
});

var buildAppDeps;
if (cfg.appConfig.isDebug === true) {
    // Copy *.ts if debug
    buildAppDeps = ['less', 'copy-ts'];
} else {
    buildAppDeps = ['less'];
}

gulp.task('compile-ts', buildAppDeps, function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src("app/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    var tsResultJs = tsResult.js;
    if (cfg.appConfig.isDebug === true) {
        // Generete map if debug
        tsResultJs = tsResultJs.pipe(sourcemaps.write({
            sourceRoot: function (file) {
                var sourceFile = path.join(file.cwd, file.sourceMap.file);
                return path.relative(path.dirname(sourceFile), file.cwd);
            }
        }));
    }

    return tsResultJs.pipe(gulp.dest('wwwroot/app'));
});

gulp.task('only-copy-js', [], function () {
    return gulp.src('app/**/*.js')
        .pipe(gulp.dest('wwwroot/app/'));
});

gulp.task('only-copy-html', [], function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('wwwroot/app/'));
});

gulp.task('only-copy-ts', [], function () {
    return gulp.src('app/**/*.ts')
        .pipe(gulp.dest('wwwroot/app/'));
});

gulp.task('only-compile-ts', ['only-copy-ts'], function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src("app/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    var tsResultJs = tsResult.js;

    tsResultJs = tsResultJs.pipe(sourcemaps.write({
        sourceRoot: function (file) {
            var sourceFile = path.join(file.cwd, file.sourceMap.file);
            return path.relative(path.dirname(sourceFile), file.cwd);
        }
    }));

    return tsResultJs.pipe(gulp.dest('wwwroot/app'));
});

gulp.task('watch-dogs', function () {
    gulp.watch("app/**/*.ts", ['only-compile-ts']);
    gulp.watch("app/**/*.html", ['only-copy-html']);
    gulp.watch("app/**/*.js", ['only-copy-js']);
});

gulp.task('default', ['copy-lib', 'compile-ts']);