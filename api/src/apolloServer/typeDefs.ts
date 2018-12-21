import { gql } from 'apollo-server-express'

export default gql`
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
    imagePath: String
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
      imagePath: String
      name: String
      ovenClean: Boolean
      radius: Int
    ): Service
  }

  type Query {
    service(id: ID!): Service
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
