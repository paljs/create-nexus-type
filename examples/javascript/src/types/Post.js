const { objectType, extendType } = require('nexus')

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.model.id()
    t.model.author()
  },
})

const postQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.post()
    t.crud.posts({ filtering: true, ordering: true })
  },
})

const postMutation = extendType({
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
module.exports = {
	Post,
	postQuery,
	postMutation,
}