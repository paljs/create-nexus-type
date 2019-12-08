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
  -mq      add this option to create Queries and Mutations for models 
  -m       add this option to create Mutations
  -q       add this option to create Queries
  -f       add this option to add {filtering: true} option to Queries
  -o       add this option to add {ordering: true} option to Queries
```

### Example

```prisma
// schema.prisma

generator photonjs {
  provider = "photonjs"
}

model User {
  id        String   @id @unique @default(cuid())
  email     String   @unique
  birthDate DateTime
  posts     Post[]
}

model Post {
  id     String @id @unique @default(cuid())
  author User[]
}
```

run 

```
npx cnt
```

OutPut

```ts
// User.ts
import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.birthDate()
    t.model.posts()
  },
})
```

```ts
// Post.ts
import { objectType } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.author()
  },
})
```

```ts
// index.ts
export * from './User'
export * from './Post'
```

## Create Queries and Mutations 

run 

```
npx cnt --mq -f -o
```

OutPut

```ts
import { objectType, extendType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.birthDate()
    t.model.posts()
  },
})

export const userQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.user()
    t.crud.users({ filtering: true, ordering: true })
  },
})

export const userMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneUser()
    t.crud.updateOneUser()
    t.crud.upsertOneUser()
    t.crud.deleteOneUser()

    t.crud.updateManyUser()
    t.crud.deleteManyUser()
  },
})
```

## Create TypeScript types

And have another option to create TypeScript types to use for your work 

### Command options for `create-types`

```
  usage: create-types (Crete TypeScript types from Prisma schema)
  --schema To add schema file path if you not run command in root of project
  --outDir Created files output dir default src/generated
```

### Example

```prisma
// schema.prisma

generator photonjs {
  provider = "photonjs"
}

model User {
  id        String   @id @unique @default(cuid())
  email     String   @unique
  birthDate DateTime?
  role      UserRole
  posts     Post[]
}

model Post {
  id     String @id @unique @default(cuid())
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
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

## Have questions?

Didn't find something here? Look through the [issues](https://github.com/oahtech/create-nexus-type/issues) or simply drop us a line at <ahmed.elywa@icloud.com>.

# Like my tool give me star 
