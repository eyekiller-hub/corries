var glob = require('glob');

var content = glob.sync('**/*.liquid', { ignore: '**/*.min.css.liquid' });

module.exports = {
  content: content,
  css: ['./assets/theme.default.min.css'],
  whitelistPatterns: [/^(is-|has-|will-|js-|swiper-|fancybox-|template-|style)/],
  defaultExtractor: (content) => content.match(/[\w-/:!]+(?<!:)/g) || []
};
