const path = require('path');

let config = {};
config.themeName = 'bokex';
config.themeDir = path.join(path.resolve('.'), `theme/${config.themeName}`);
config.devJscmsServerDir = path.resolve('../jscms-server');

module.exports = config;