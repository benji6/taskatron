import { ApolloServer, gql } from 'apollo-server-express'
import { countServices, searchServices } from './model/services'
import { IServiceSearchParams } from './shared/types'

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
    ovenClean: Boolean!
    radius: Int!
    userId: String!
  }

  type Services {
    nodes: [Service!]!
    total: Int!
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
    ): Services
  }
`

const resolvers = {
  Query: {
    services: async (_: unknown, args: object) => {
      const searchParams: IServiceSearchParams = args as IServiceSearchParams

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

export default new ApolloServer({ typeDefs, resolvers })
