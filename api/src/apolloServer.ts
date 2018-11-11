import { ApolloServer, gql } from 'apollo-server-express'
import {
  countServices,
  getServiceByUserId,
  searchServices,
} from './model/services'
import { IServiceSearchParams } from './shared/types'

interface IContext {
  userId: string
}

const context = async ({ req }: any): Promise<IContext> => ({
  userId: req.user,
})

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

  type Query {
    service(userId: ID): Service
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
    ): Services
  }
`

const resolvers = {
  Query: {
    service: async (_: unknown, args: any) => {
      const service = await getServiceByUserId(args.userId)

      if (!service) return null

      const { _id, userId, ...rest } = service

      return {
        ...rest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
    services: async (_: unknown, args: object) => {
      const searchParams = args as IServiceSearchParams

      const { limit, skip, ...filters } = searchParams

      const [services, total] = await Promise.all([
        searchServices(searchParams),
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

export default new ApolloServer({ context, resolvers, typeDefs })
