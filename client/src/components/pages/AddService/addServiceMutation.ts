import { gql } from 'apollo-boost'

export default gql`
  mutation AddService(
    $carpetClean: Boolean
    $deepClean: Boolean
    $description: String!
    $general: Boolean
    $hasOwnEquipment: Boolean
    $hasOwnProducts: Boolean
    $hourlyRate: Float!
    $name: String!
    $ovenClean: Boolean
    $radius: Int!
    $userId: ID!
  ) {
    addService(
      carpetClean: $carpetClean
      deepClean: $deepClean
      description: $description
      general: $general
      hasOwnEquipment: $hasOwnEquipment
      hasOwnProducts: $hasOwnProducts
      hourlyRate: $hourlyRate
      name: $name
      ovenClean: $ovenClean
      radius: $radius
      userId: $userId
    ) {
      carpetClean
      deepClean
      description
      general
      hasOwnEquipment
      hasOwnProducts
      hourlyRate
      id
      name
      ovenClean
      radius
      userId
    }
  }
`
