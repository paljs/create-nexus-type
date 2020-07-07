#!/usr/bin/env node

const arg = require('arg');
const { ConvertSchemaToObject } = require('@paljs/schema');
const buildForSchemaVersion = require('./schema');
const buildForNexusVersion = require('./nexus');

function getArgs() {
  const args = arg({
    '--help': Boolean,
    '--schema': String,
    '--outDir': String,
    '--mq': Boolean,
    '-m': Boolean,
    '-q': Boolean,
    '-c': Boolean,
    '-f': Boolean,
    '-o': Boolean,
    '-s': Boolean,
    '--js': Boolean,
    '--mjs': Boolean,
    '-h': '--help',
  });
  return {
    ...args,
    '--schema': args['--schema'] || 'prisma/schema.prisma',
    '--outDir': args['--outDir'] || 'src/types',
  };
}

function cli() {
  const args = getArgs();
  if (args['--help']) {
    help();
    return;
  }
  const schema = new ConvertSchemaToObject(args['--schema']).run();
  if (args['-s']) {
    buildForSchemaVersion(schema, args);
  } else {
    buildForNexusVersion(schema, args);
  }
}

function help() {
  const helpContent = `
  usage: cnt (create nexus types from Prisma schema)
  --schema To add schema file path if you not run command in root of project
  --outDir Created files output dir default src/types
  -s       add this option to use @nexus/schema package
  -mq      add this option to create Queries and Mutations for models 
  -m       add this option to create Mutations
  -q       add this option to create Queries
  -c       add this option to create Queries Count
  -f       add this option to add {filtering: true} option to Queries
  -o       add this option to add {ordering: true} option to Queries
  --js     create javascript version
  --mjs    create es modules version  
  `;
  console.log(helpContent);
}

cli();
