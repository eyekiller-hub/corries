var path = require("path");

module.exports = {
  entry: [
    "./assets/theme.js"
  ],
  output: {
    path: path.resolve(__dirname, "assets"),
    publicPath: "/assets/",
    filename: "theme.min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  "targets": {
                    "chrome": "49",
                    "ie": "10",
                    "safari": "9"
                  }
                }
              ]
            ],
            plugins: [
              ["transform-react-jsx", { "pragma": "h" }],
              ["transform-class-properties", { "loose": true }]
            ]
          }
        }
      }
    ]
  }
};
