#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');

function getArgs() {
	const args = arg({
		'--help': Boolean,
		'--schema': String,
		'--outDir': String,
		'--mq': Boolean,
		'-m': Boolean,
		'-q': Boolean,
		'-f': Boolean,
		'-o': Boolean,
		'-h': '--help'
	});
	return {
		...args,
		'--schema': args['--schema'] || 'prisma/schema.prisma',
		'--outDir': args['--outDir'] || 'src/types'
	};
}

function cli() {
	const args = getArgs();
	if (args['--help']) {
		help();
		return;
	}
	fs.readFile(args['--schema'], { encoding: 'utf-8' }, function(err, data) {
		if (!err) {
			let fileContent = '';
			let fileName = '';
			let index = '';
			const dir = args['--outDir'] + '/';
			const lines = data.split(`
`);
			lines.map(line => {
				if (line !== '') {
					const lineArray = line.split(' ');
					if (lineArray[0] === 'model') {
						index += `export * from './${lineArray[1]}';
`;
						fileName = lineArray[1] + '.ts';
						fileContent = `import { objectType${args['--mq'] || args['-q'] || args['-m'] ? ', extendType' : ''} } from 'nexus'

export const ${lineArray[1]} = objectType({
  name: '${lineArray[1]}',
  definition(t) {`;
					} else if (fileContent !== '') {
						if (lineArray[0] !== '}') {
							fileContent += `
    t.model.${lineArray[2]}()`;
						} else {
							fileContent += `
  },
})`;
const model = fileName.split('.')[0];
const modelName = getModelName(model);
							if (args['--mq'] || args['-q']) {
								fileContent += `

export const ${modelName.singular}Query = extendType({
  type: 'Query',
  definition(t) {
    t.crud.${modelName.singular}()
    t.crud.${modelName.plural}(${args['-f'] && args['-o'] ? '{ filtering: true, ordering: true }' : args['-f'] ? '{ filtering: true }' : args['-o'] ? '{ ordering: true }' : ''})
  },
})`;
              }
              if(args['--mq'] || args['-m']) {
                fileContent += `

export const ${modelName.singular}Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOne${model}()
    t.crud.updateOne${model}()
    t.crud.upsertOne${model}()
    t.crud.deleteOne${model}()

    t.crud.updateMany${model}()
    t.crud.deleteMany${model}()
  },
})`;
              }
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

function help() {
  const helpContent = `
  usage: cnt (create nexus types from Prisma schema)
  --schema To add schema file path if you not run command in root of project
  --outDir Created files output dir default src/types
  -mq      add this arg to create Queries and Mutations for models 
  -m       add this arg to create Mutations
  -q       add this arg to create Queries
  -f       add this arg to add {filtering: true} option to Queries
  -o       add this arg to add {ordering: true} option to Queries
  `;
  console.log(helpContent);
}

function getModelName(model) {
	let newName = model.charAt(0).toLowerCase() + model.slice(1);
  let lastLetter = newName.slice(-1);
  let plural = '';
	if (lastLetter != 's' && lastLetter != 'y') {
		plural = newName + 's';
	} else if (lastLetter == 'y') {
		plural = newName.slice(0, -1) + 'ies';
	} else {
		plural = newName;
  }
  return {
    plural,
    singular: newName
  }
}
cli();
