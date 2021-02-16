var { src, dest, watch, parallel } = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var purgecss = require('gulp-purgecss');
var glob = require('glob');

sass.compiler = require('node-sass');

function sass_default_build() {
  return src('./assets/theme.default.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename('theme.default.min.css'))
    .pipe(dest('./assets'));
};

function sass_default_watch() {
  return watch('./assets/*.scss', sass_default_build)
};

function sass_amp_build() {
  var content = glob.sync('**/*.liquid', { ignore: '**/*.min.css.liquid' });

  return src('./assets/theme.amp.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(purgecss({
      content: content,
      whitelistPatterns: [/^(is-|has-|will-|js-|swiper-|fancybox-|template-|style)/],
      defaultExtractor: (content) => content.match(/[\w-/:!]+(?<!:)/g) || []
    }))
    .pipe(rename('theme.amp.min.css.liquid'))
    .pipe(dest('./snippets'));
};

function sass_amp_watch() {
  var content = glob.sync('**/*.liquid', { ignore: '**/*.min.css.liquid' });

  return watch(['./assets/*.scss', ...content], sass_amp_build)
};

function sass_build() {
  return parallel(sass_default_build, sass_amp_build);
};

function sass_watch() {
  return parallel(sass_default_watch, sass_amp_watch);
};

exports['sass:default:build'] = sass_default_build;
exports['sass:default:watch'] = sass_default_watch;

exports['sass:amp:build'] = sass_amp_build;
exports['sass:amp:watch'] = sass_amp_watch;

exports['sass:build'] = sass_build();
exports['sass:watch'] = sass_watch();
