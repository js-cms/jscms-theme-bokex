const fs = require('fs-extra');
const config = require('./jscms-theme.config.js');
const themeDir = `${config.devJscmsServerDir}/app/theme/${config.themeName}/`;
const JscmsServerThemeConfig = `${config.devJscmsServerDir}/config/theme.js`;
let themeConfigContent = fs.readFileSync(JscmsServerThemeConfig, 'utf-8');
let reg = /^const\sTHEME_NAME\s=\s'(\w+)';$/gm;
let constStr = reg.exec(themeConfigContent)[0];
let newThemeConfigContent = themeConfigContent.replace(constStr, `const THEME_NAME = 'bokex';`);
fs.writeFileSync(JscmsServerThemeConfig, newThemeConfigContent);

console.log('\n');
console.log(` write file ${JscmsServerThemeConfig}`);
fs.removeSync(themeDir);
console.log(` remove ${themeDir}`);
fs.copySync(config.themeDir, themeDir);
console.log(` copy ${config.themeDir} to ${themeDir}`);
console.log('\n');