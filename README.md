# Corries

## Requirements

* Node.js (Download and run the installer from [nodejs.org](http://nodejs.org))
* Shopify Theme Kit (Download and run the installer from [shopify.github.io/themekit](https://shopify.github.io/themekit))
* mkcert (Follow instructions from the [git repo](https://github.com/FiloSottile/mkcert))

## Development

1. Download or clone this repo
1. Move to the appropriate directory: `cd corries`
1. Execute the command `bash ssl-check.sh` to ensure locally-trusted development certificates exist
1. Execute the command `npm i` to install the npm dependencies necessary to run the development process
1. Execute the command `npm start` - this will start the development process which compiles/watches JS/SCSS and starts the Shopify uploader/watcher