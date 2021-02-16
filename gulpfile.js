var { src, dest, watch, parallel } = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

sass.compiler = require('node-sass');

function sass_build() {
  return src('./assets/theme.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename('theme.min.css'))
    .pipe(dest('./assets'));
};

function sass_watch() {
  return watch('./assets/*.scss', sass_build)
};

exports['sass:build'] = sass_build;
exports['sass:watch'] = sass_watch;
