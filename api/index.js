var fs = require('fs');
var glob = require('glob');

check_unused_snippets();
check_unused_sections();
check_unused_layouts();
check_unused_locales();
check_unused_settings();
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

  sections = sections.filter((section) => !section.includes('homepage-'));

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

function check_unused_layouts() {
  var files = glob.sync('./**/*.liquid');

  var layouts = glob.sync('./layout/*.liquid').map((_) => _.split('/').pop().split('.')[0]);

  layouts = layouts.filter((layout) => layout != 'theme');

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var unused_layouts = layouts.filter((layout) => {
    return (
      !files_string.includes(`layout '${layout}'`) &&
      !files_string.includes(`layout "${layout}"`)
    );
  });

  console.log({unused_layouts});
};

function check_unused_locales() {
  var files = glob.sync('./**/*.liquid');

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var locale_file = fs.readFileSync('./locales/en.default.json', 'utf8');

  var obj = JSON.parse(locale_file);

  var res = {};

  (function recurse(obj, current) {
    for(var key in obj) {
      var value = obj[key];
      var newKey = (current ? current + "." + key : key);
      if(value && typeof value === "object") {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  })(obj);

  var locales_keys = Object.keys(res);

  var unused_locales = locales_keys.filter((locales_key) => {
    return !files_string.includes(locales_key);
  });

  console.log({unused_locales});
};

function check_unused_settings() {
  var files = glob.sync('./**/*.liquid');

  var files_string = files
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('');

  var settings_file = fs.readFileSync('./config/settings_schema.json', 'utf8');

  var settings_object = JSON.parse(settings_file);

  var settings_ids = settings_object
    .map((settings_object_item) => {
      return (
        settings_object_item.settings &&
        settings_object_item.settings.map((setting) => setting.id)
      );
    })
    .flat()
    .filter(Boolean);

  var unused_settings = settings_ids.filter((settings_id) => {
    return !files_string.includes(`settings.${settings_id}`);
  });

  console.log({unused_settings});
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
