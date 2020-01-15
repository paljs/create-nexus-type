#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');

function getArgs() {
  const args = arg({
    '--schema': String,
    '--outDir': String,
  });
  return {
    '--schema': args['--schema'] || 'prisma/schema.prisma',
    '--outDir': args['--outDir'] || 'src/generated',
  };
}

function cli() {
  const args = getArgs();
  fs.readFile(args['--schema'], { encoding: 'utf-8' }, function(err, data) {
    if (!err) {
      let fileContent = '';
      let inModel = false;
      const dir = args['--outDir'] + '/';
      const lines = data.split(`
`);
      lines.map(line => {
        if (line !== '') {
          const lineArray = line.split(' ');
          const filteredArray = lineArray.filter(v => v);
          if (['model', 'enum'].includes(filteredArray[0])) {
            fileContent +=
              fileContent !== ''
                ? `

`
                : '';
            fileContent +=
              filteredArray[0] === 'model' ? `export interface ${filteredArray[1]} {` : `enum ${filteredArray[1]} {`;
            inModel = filteredArray[0];
          } else if (inModel && !filteredArray[0].includes('//') && !filteredArray[0].includes('@@')) {
            if (filteredArray[0] !== '}') {
              if (inModel === 'enum') {
                fileContent += `
  ${filteredArray[0]} = '${filteredArray[0]}',`;
              } else {
                const type = types[filteredArray[1].replace('?', '')]
                  ? types[filteredArray[1].replace('?', '')] + (filteredArray[1].includes('?') ? ' | null' : '')
                  : filteredArray[1].replace('?', ' | null');
                fileContent += `
  ${filteredArray[0]}: ${type};`;
              }
            } else {
              fileContent += `
}`;
              inModel = false;
            }
          }
        }
      });
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFile(dir + 'types.ts', fileContent, () => {});
      console.log('Created files success');
    } else {
      console.log(err);
    }
  });
}
const types = {
  Int: 'number',
  Float: 'number',
  String: 'string',
  Boolean: 'boolean',
  'Int[]': 'number[]',
  'Float[]': 'number[]',
  'String[]': 'string[]',
  'Boolean[]': 'boolean[]',
  DateTime: 'Date',
};
cli();
