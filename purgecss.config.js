var glob = require('glob');

var content = glob.sync('**/*.liquid');

module.exports = {
  content: content,
  css: ['./assets/theme.min.css'],
  defaultExtractor: (content) => content.match(/[\w-/:!]+(?<!:)/g) || []
};
