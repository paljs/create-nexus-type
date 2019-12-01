# Create nexus type?

This is Cli tool to Create nexus type for Prisma projects. When you try to upgrade from Prisma 1 to Prisma 2 and need to write nexus types for your models this tool will create this types for you from your `schema.prisma` file

## How use?

```
yarn add -D create-nexus-type
or 
npm i create-nexus-type --save-dev
```

After that you can run 

```
npx cnt
// Customize output dir or schema.prisma dir
npx cnt --outDir src/types --schema prisma/schema.prisma // this default values you can change them 
```

And have another option to crete TypeScript types to use for your work 

```
npx create-types
// Customize output dir or schema.prisma dir
npx create-types --outDir src/generated --schema prisma/schema.prisma // this default values you can change them 
```

## Have questions?

Didn't find something here? Look through the [issues](https://github.com/oahtech/create-nexus-type/issues) or simply drop us a line at <ahmed.elywa@icloud.com>.
