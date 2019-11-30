#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');

function getArgs() {
  const args = arg({
    '--schema': String,
    '--outDir': String
  });
  return {
    '--schema': args['--schema'] || 'prisma/schema.prisma',
    '--outDir': args['--outDir'] || 'src/types/'
  };
}

function cli() {
  const args = getArgs();
  fs.readFile(args["--schema"], { encoding: 'utf-8' }, function(
    err,
    data
  ) {
    if (!err) {
      let fileContent = '';
      let fileName = '';
      let index = '';
      const dir = args["--outDir"] + "/";
      const lines = data.split(`
`);
      lines.map(line => {
        if (line !== '') {
          const lineArray = line.split(' ');
          if (lineArray[0] === 'model') {
            index += `export * from './${lineArray[1]}';
`;
            fileName = lineArray[1] + '.ts';
            fileContent = `import {objectType} from 'nexus';
      
export const ${lineArray[1]} = objectType({
    name: "${lineArray[1]}",
    definition(t) {`;
          } else if (fileContent !== '') {
            if (lineArray[0] !== '}') {
              fileContent += `
        t.model.${lineArray[2]}()`;
            } else {
              fileContent += `
    }
});`;
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
              }
              fs.writeFile(dir + fileName, fileContent, () => {});
              fileContent = '';
              fileName = '';
            }
          }
        }
      });
      fs.writeFile(dir + 'index.ts', index, () => {});
      console.log('Created files success');
    } else {
      console.log(err);
    }
  });
}
cli();
