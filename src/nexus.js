const format = require('./format');
const pluralize = require('pluralize');
const fs = require('fs');

function buildForNexusVersion(schema, args) {
  const dir = args['--outDir'] + '/';
  schema.models.forEach((model) => {
    let fileContent = '';
    fileContent = `import { schema } from 'nexus';
    
      `;
    fileContent += `schema.objectType({
  name: '${model.name}',
  definition(t) {`;
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

    let queryCount=''
    if(args['-c']) {
      queryCount = `
      t.field('${modelName.plural}Count', {
        type: 'Int',
        args: {
          where: '${model.name}WhereInput',
        },
        async resolve(_root, args, ctx) {
          return ctx.prisma.${modelName.singular}.count(args)
        },
      })`;
    }

    if (args['--mq'] || args['-q']) {
      fileContent += `

schema.extendType({
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
${queryCount}
  },
})`;
    }
    if (args['--mq'] || args['-m']) {
      fileContent += `

schema.extendType({
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
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir + model.name + '.ts', format(fileContent, true), () => {});
  });
}

module.exports = buildForNexusVersion;
