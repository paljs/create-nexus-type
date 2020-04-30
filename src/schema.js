const format = require('./format');
const pluralize = require('pluralize');
const fs = require('fs');

function buildForSchemaVersion(schema, args) {
  let index = '';
  const dir = args['--outDir'] + '/';
  let moduleExports = '';
  schema.models.forEach((model) => {
    let fileContent = '';
    if (args['--js']) {
      index += `...require('./${model.name}'),`;
    } else {
      index += `export * from './${model.name}';`;
    }
    fileContent = `${args['--js'] ? 'const' : 'import'} { objectType${
      args['--mq'] || args['-q'] || args['-m'] ? ', extendType' : ''
    } } ${
      args['--js'] ? `= require('@nexus/schema')` : ` from '@nexus/schema'`
    };
      
      `;
    fileContent += `export const ${model.name} = objectType({
  name: '${model.name}',
  definition(t) {`;
    moduleExports = `	${model.name},`;
    model.fields.forEach((field) => {
      fileContent += `
    t.model.${field.name}()`;
    });
    fileContent += `
  },
})`;
    const newName = model.name.charAt(0).toLowerCase() + model.name.slice(1);
    const modelName = {
      plural: pluralize(newName),
      singular: newName,
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
	${modelName.singular}Query,`;
    }
    if (args['--mq'] || args['-m']) {
      fileContent += `

${args['--js'] ? '' : 'export '}const ${
        modelName.singular
      }Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOne${model.name}()
    t.crud.updateOne${model.name}()
    t.crud.upsertOne${model.name}()
    t.crud.deleteOne${model.name}()

    t.crud.updateMany${model.name}()
    t.crud.deleteMany${model.name}()
  },
})`;
      moduleExports += `
	${modelName.singular}Mutation,`;
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (args['--js']) {
      fileContent += `
module.exports = {
${moduleExports}
}`;
    }
    fs.writeFile(
      dir + model.name + (args['--js'] || args['--mjs'] ? '.js' : '.ts'),
      format(fileContent, args['--js'] || args['--mjs']),
      () => {}
    );
  });
  if (args['--js']) {
    index = `module.exports = {
${index}}`;
  }
  fs.writeFile(
    dir + `index.${args['--js'] || args['--mjs'] ? 'js' : 'ts'}`,
    format(index, args['--js'] || args['--mjs']),
    () => {}
  );
}

module.exports = buildForSchemaVersion;
