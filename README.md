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

And have another option to crete TypeScript types to use for your work 

```
npx create-types
// Customize output dir or schema.prisma dir
npx create-types --outDir src/generated --schema prisma/schema.prisma // this default values you can change them 
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
