import {
  ApolloServer,
  AuthenticationError,
  gql,
  UserInputError,
} from 'apollo-server-express'
import {
  addService,
  countServices,
  deleteService,
  getService,
  getServiceByUserId,
  searchServices,
  updateService,
} from './model/services'
import { getUser } from './model/user'
import pino from './pino'
import { IUserDocument } from './shared/types'

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
    description: String!
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
    addService(
      carpetClean: Boolean
      deepClean: Boolean
      description: String!
      general: Boolean
      hasOwnEquipment: Boolean
      hasOwnProducts: Boolean
      hourlyRate: Float!
      name: String!
      ovenClean: Boolean
      radius: Int!
      userId: ID!
    ): Service
    deleteService(id: ID!): Service
    updateService(
      carpetClean: Boolean
      deepClean: Boolean
      description: String
      general: Boolean
      hasOwnEquipment: Boolean
      hasOwnProducts: Boolean
      hourlyRate: Float
      id: ID!
      name: String
      ovenClean: Boolean
      radius: Int
    ): Service
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
    addService: async (_: unknown, args: any, context: IContext) => {
      if (args.userId !== context.userId) {
        throw new AuthenticationError('authed user does not match record user')
      }

      if (await getServiceByUserId(args.userId)) {
        throw new UserInputError('record already exists')
      }

      const { location } = (await getUser(args.userId)) as IUserDocument

      const { _id, userId, ...serviceDocumentRest } = await addService({
        ...args,
        location,
      })

      return {
        ...serviceDocumentRest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
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
    updateService: async (_: unknown, args: any, context: IContext) => {
      const service = await getService(args.id)

      if (!service) throw new UserInputError('not found')

      const { _id, userId, ...rest } = service

      if (!(userId as any).equals(context.userId)) {
        throw new AuthenticationError('authed user does not match record user')
      }

      const { id, ...restArgs } = args

      await updateService({
        _id: id,
        ...restArgs,
      })

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
  formatError: (error: Error) => {
    pino.error('Apollo error:', error)
    return error
  },
  formatResponse: (response: object) => {
    pino.info('Apollo response:', response)
    return response
  },
  resolvers,
  typeDefs,
})
