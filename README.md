# Create nexus type?

This is Cli tool to Create nexus type for Prisma projects. When you try to upgrade from Prisma 1 to Prisma 2 and need to write nexus types for your models this tool will create this types for you from your `schema.prisma` file

## How use?

```
yarn add -D create-nexus-type
or
npm i create-nexus-type --save-dev
```

### Command options for `cnt`

```
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
```

### Example

```prisma
// schema.prisma

datasource postgresql {
  url      = env("DATABASE_URL")
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  birthDate DateTime
  posts     Post[]
}

model Post {
  id     String @id @default(cuid())
  author User[]
}
```

run

```
npx cnt --mq -c -f -o
```

OutPut

```ts
// User.ts
import { schema } from "nexus";

schema.objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.birthDate();
    t.model.role();
    t.model.posts();
  },
});

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.user();
    t.crud.users({ filtering: true, ordering: true });

    t.field("usersCount", {
      type: "Int",
      args: {
        where: "UserWhereInput",
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.user.count(args);
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneUser();
    t.crud.updateOneUser();
    t.crud.upsertOneUser();
    t.crud.deleteOneUser();

    t.crud.updateManyUser();
    t.crud.deleteManyUser();
  },
});
```

```ts
// Post.ts
import { schema } from "nexus";

schema.objectType({
  name: "Post",
  definition(t) {
    t.model.id();
    t.model.author();
  },
});

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.post();
    t.crud.posts({ filtering: true, ordering: true });

    t.field("postsCount", {
      type: "Int",
      args: {
        where: "PostWhereInput",
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.post.count(args);
      },
    });
  },
});

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOnePost();
    t.crud.updateOnePost();
    t.crud.upsertOnePost();
    t.crud.deleteOnePost();

    t.crud.updateManyPost();
    t.crud.deleteManyPost();
  },
});
```

## Use `@nexus/schema` version

run

```
npx cnt -s --mq -c -f -o
```

OutPut

```ts
import { objectType, extendType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.birthDate();
    t.model.posts();
  },
});

export const userQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.user();
    t.crud.users({ filtering: true, ordering: true });

    t.field("usersCount", {
      type: "Int",
      args: {
        where: "UserWhereInput",
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.user.count(args);
      },
    });
  },
});

export const userMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneUser();
    t.crud.updateOneUser();
    t.crud.upsertOneUser();
    t.crud.deleteOneUser();

    t.crud.updateManyUser();
    t.crud.deleteManyUser();
  },
});
```

## Create TypeScript types

Have another option to create TypeScript types to use for your work

### Command options for `create-types`

```
  usage: create-types (Create TypeScript types from Prisma schema)
  --schema To add schema file path if you not run command in root of project
  --outDir Created files output dir default src/generated
```

### Example

```prisma
// schema.prisma

datasource postgresql {
  url      = env("DATABASE_URL")
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  birthDate DateTime?
  role      UserRole
  posts     Post[]
}

model Post {
  id     String @id @default(cuid())
  author User[]
}

enum UserRole {
  USER
  ADMIN
}
```

run

```
npx create-types
```

OutPut

```ts
// types.ts
export interface User {
  id: string;
  email: string;
  birthDate: Date | null;
  role: UserRole;
  posts: Post[];
}

export interface Post {
  id: string;
  author: User[];
}

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
```

## Have questions?

Didn't find something here? Look through the [issues](https://github.com/AhmedElywa/create-nexus-type/issues) or simply drop us a line at <ahmed.elywa@icloud.com>.

# Like my tool give me star
