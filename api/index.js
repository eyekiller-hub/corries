var fs = require('fs');
var glob = require('glob');

check_unused_snippets();
check_unused_sections();
check_unused_modules();

function check_unused_snippets() {
  var files = glob.sync('./**/*.liquid');

  var snippets = glob.sync('./snippets/*.liquid').map((_) => _.split('/').pop().split('.')[0]);

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var unused_snippets = snippets.filter((snippet) => {
    return (
      !files_string.includes(`include '${snippet}'`) &&
      !files_string.includes(`include "${snippet}"`) &&
      !files_string.includes(`render '${snippet}'`) &&
      !files_string.includes(`render "${snippet}"`)
    );
  });

  console.log({unused_snippets});
};

function check_unused_sections() {
  var files = glob.sync('./**/*.liquid');

  var sections = glob.sync('./sections/*.liquid').map((_) => _.split('/').pop().split('.')[0]);

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var unused_sections = sections.filter((section) => {
    return (
      !files_string.includes(`section '${section}'`) &&
      !files_string.includes(`section "${section}"`)
    );
  });

  console.log({unused_sections});
};


function check_unused_modules() {
  var files = glob.sync('./**/*.liquid');

  var modules = glob.sync('./assets/module-*.js').map((_) => `data-${_.split('/').pop().split('.')[0]}`);

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var unused_modules = modules.filter((module) => {
    return !files_string.includes(module);
  });

  console.log({unused_modules});
};
