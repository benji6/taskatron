import {
  ApolloServer,
  AuthenticationError,
  gql,
  UserInputError,
} from 'apollo-server-express'
import {
  countServices,
  deleteService,
  getService,
  searchServices,
} from './model/services'

interface IContext {
  userId: string
}

const typeDefs = gql`
  interface Node {
    id: ID!
  }

  type Location {
    coordinates: [Float!]!
    type: String!
  }

  type Service implements Node {
    carpetClean: Boolean!
    deepClean: Boolean!
    general: Boolean!
    hasOwnEquipment: Boolean!
    hasOwnProducts: Boolean!
    hourlyRate: Float!
    id: ID!
    location: Location!
    name: String!
    ovenClean: Boolean!
    radius: Int!
    userId: String!
  }

  type Services {
    nodes: [Service!]!
    total: Int!
  }

  type Mutation {
    deleteService(id: ID!): Service
  }

  type Query {
    services(
      carpetClean: Boolean
      deepClean: Boolean
      general: Boolean
      hasOwnEquipment: Boolean
      hasOwnProducts: Boolean
      hourlyRate: Float
      limit: Int!
      ovenClean: Boolean
      skip: Int
      userId: ID
    ): Services
  }
`

const resolvers = {
  Mutation: {
    deleteService: async (_: unknown, args: any, context: IContext) => {
      const service = await getService(args.id)

      if (!service) throw new UserInputError('not found')

      const { _id, userId, ...rest } = service

      if (!(userId as any).equals(context.userId)) {
        throw new AuthenticationError('authed user does not match record user')
      }

      await deleteService(_id)

      return {
        ...rest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
  },
  Query: {
    services: async (_: unknown, args: any) => {
      const { limit, skip, ...filters } = args

      const [services, total] = await Promise.all([
        searchServices({ ...args, skip: args.skip || 0 }),
        countServices(filters),
      ])

      return {
        nodes: services.map(({ _id, userId, ...rest }) => ({
          ...rest,
          id: _id.toString(),
          userId: userId.toString(),
        })),
        total,
      }
    },
  },
}

export default new ApolloServer({
  context: async ({ req }: any): Promise<IContext> => ({
    userId: req.user,
  }),
  resolvers,
  typeDefs,
})
