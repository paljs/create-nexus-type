const { objectType, extendType } = require('@nexus/schema')

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.email()
    t.model.birthDate()
    t.model.role()
    t.model.posts()
  },
})

const userQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.user()
    t.crud.users({ filtering: true, ordering: true })

    t.field('usersCount', {
      type: 'BatchPayload',
      args: {
        where: 'UserWhereInput',
      },
      async resolve(_root, { where }, ctx) {
        const count = await ctx.prisma.user.count({ where })
        return { count }
      },
    })
  },
})

const userMutation = extendType({
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
module.exports = {
  User,
  userQuery,
  userMutation,
}
