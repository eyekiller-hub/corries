var os = require("os");
var fs = require("fs");
var ip = require("my-local-ip");
var bs = require("browser-sync").create();
var yaml = require("js-yaml");
var opn = require("opn");

var config = yaml.load(fs.readFileSync("./config.yml"));
var port = 3000;

bs.init({
  port: port,
  proxy: `https://${config.development.store}?preview_theme_id=${config.development.theme_id}&${config.development.url_params}`,
  https: {
    key: `${os.homedir()}/.localhost_ssl/server.key`,
    cert: `${os.homedir()}/.localhost_ssl/server.crt`
  },
  open: "external",
  notify: false,
  serveStatic: [{
    route: "/assets",
    dir: "assets"
  }],
  rewriteRules: [
    {
      match: new RegExp(`https://${config.development.store}`, "g"),
      replace: `https://${ip()}:${port}`,
    },
    {
      match: new RegExp('".*assets/(theme.min.js)"?', "g"),
      replace: '"/assets/$1',
    },
    {
      match: new RegExp('".*assets/(theme.min.css)"?', "g"),
      replace: '"/assets/$1',
    },
    {
      match: "previewBarInjector.init();",
      replace: ""
    },
    {
      match: "adminBarInjector.init();",
      replace: ""
    },
    {
      match: new RegExp('".*productreviews.shopifycdn.com.*"', "g"),
      replace: ""
    }
  ],
  snippetOptions: {
    rule: {
      match: /<\/body>/i
    }
  }
});

fs.writeFileSync("theme.update", "");

bs.watch("assets/{theme.min.css,theme.min.js}", (event, file) => {
  bs.reload(file);
});

bs.watch("{config,layout,locales,sections,snippets,templates}/*", (event, file) => {
  var watcher = fs.watch("theme.update", () => {
    bs.reload();
    watcher.close();
  });
});
