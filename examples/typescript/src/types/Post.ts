import { schema } from 'nexus'

schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.author()
  },
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.crud.post()
    t.crud.posts({ filtering: true, ordering: true })
  },
})

schema.extendType({
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
