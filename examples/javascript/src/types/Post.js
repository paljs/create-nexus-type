const { objectType, extendType } = require('@nexus/schema')

const Post = objectType({
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

    t.field('postsCount', {
      type: 'Int',
      args: {
        where: 'PostWhereInput',
      },
      async resolve(_root, args, ctx) {
        return ctx.prisma.post.count(args)
      },
    })
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
