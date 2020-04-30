const prettier = require('prettier');

function format(content, type) {
  return prettier.format(content, {
    semi: !type,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
    parser: 'babel' + (type ? '-ts' : ''),
  });
}

module.exports = format;
