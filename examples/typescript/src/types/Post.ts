import { objectType, extendType } from 'nexus'	

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.author()
  },
})

export const postQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.post()
    t.crud.posts({ filtering: true, ordering: true })
  },
})

export const postMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOnePost()
    t.crud.updateOnePost()
    t.crud.upsertOnePost()
    t.crud.deleteOnePost()

    t.crud.updateManyPost()
    t.crud.deleteManyPost()
  },
})