#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');
const pluralize = require('pluralize');

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
		'--js': Boolean,		
		'--mjs': Boolean,	
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
			let moduleExports = '';
			const dir = args['--outDir'] + '/';
			const lines = data.split(`
`);
			lines.map(line => {
				if (line !== '') {
					const lineArray = line.split(' ');
					const filteredArray = lineArray.filter(v => v);
					if (filteredArray[0] === 'model') {
						if(args['--js']) {
							index += `    ...require('./${filteredArray[1]}'),
`;
						} if(args['--mjs']) {
							index += `export * from './${filteredArray[1]}.js';
`;	
						} else {
							index += `export * from './${filteredArray[1]}';
`;							
						}
						fileName = `${filteredArray[1]}.${args['--js'] || args['--mjs'] ? 'js': 'ts'}`;
						if(args['--js']) {
							fileContent = `const { objectType${
							args['--mq'] || args['-q'] || args['-m'] ? ', extendType' : ''
						} } = require('nexus')

`;
						} else if(args['--mjs']) {
							fileContent = `import nexus from 'nexus'
const { objectType${args['--mq'] || args['-q'] || args['-m'] ? ', extendType' : ''} } = nexus
					
`;							
					    } else {
							fileContent = `import { objectType${
								args['--mq'] || args['-q'] || args['-m'] ? ', extendType' : ''
							} } from 'nexus'	

`;							
						}
						fileContent += `export const ${filteredArray[1]} = objectType({
  name: '${filteredArray[1]}',
  definition(t) {`;
  						moduleExports = `	${filteredArray[1]},`
					} else if (fileContent !== '' && !filteredArray[0].includes('//')) {
						if (filteredArray[0] !== '}' && filteredArray[0] !== '{' && !filteredArray[0].includes("@@")) {
							fileContent += `
    t.model.${filteredArray[0]}()`;
						} else if (filteredArray[0] === '}') {
							fileContent += `
  },
})`;
							const model = fileName.split('.')[0];
							let newName = model.charAt(0).toLowerCase() + model.slice(1);
							const modelName = {
								plural: pluralize(newName),
								singular: newName
							};
							if (args['--mq'] || args['-q']) {
								fileContent += `

${args['--js'] ? '' : 'export '}const ${modelName.singular}Query = extendType({
  type: 'Query',
  definition(t) {
    t.crud.${modelName.singular}()
    t.crud.${modelName.plural}(${
									args['-f'] && args['-o']
										? '{ filtering: true, ordering: true }'
										: args['-f']
										? '{ filtering: true }'
										: args['-o']
										? '{ ordering: true }'
										: ''
								})
  },
})`;
								moduleExports += `
	${modelName.singular}Query,`
							}
							if (args['--mq'] || args['-m']) {
								fileContent += `

${args['--js'] ? '' : 'export '}const ${modelName.singular}Mutation = extendType({
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
								moduleExports += `
	${modelName.singular}Mutation,`
							}
							if (!fs.existsSync(dir)) {
								fs.mkdirSync(dir);
							}
							if(args['--js']) {
								fileContent += `
module.exports = {
${moduleExports}
}`;
							}
							fs.writeFile(dir + fileName, fileContent, () => {});
							fileContent = '';
							fileName = '';
						}
					}
				}
			});
			if(args['--js']) {
				index = `module.exports = {
${index}}`;
			}
			fs.writeFile(dir + `index.${args['--js'] || args['--mjs'] ? 'js': 'ts'}`, index, () => {});
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
  -mq      add this option to create Queries and Mutations for models 
  -m       add this option to create Mutations
  -q       add this option to create Queries
  -f       add this option to add {filtering: true} option to Queries
  -o       add this option to add {ordering: true} option to Queries
  --js     create javascript version
  --mjs    create es modules version  
  `;
	console.log(helpContent);
}

cli();
