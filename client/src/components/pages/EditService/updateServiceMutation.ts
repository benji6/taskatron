import { gql } from 'apollo-boost'

export default gql`
  mutation UpdateService(
    $carpetClean: Boolean
    $deepClean: Boolean
    $description: String!
    $general: Boolean
    $hasOwnEquipment: Boolean
    $hasOwnProducts: Boolean
    $hourlyRate: Float
    $id: ID!
    $name: String
    $ovenClean: Boolean
    $radius: Int
  ) {
    updateService(
      carpetClean: $carpetClean
      deepClean: $deepClean
      description: $description
      general: $general
      hasOwnEquipment: $hasOwnEquipment
      hasOwnProducts: $hasOwnProducts
      hourlyRate: $hourlyRate
      id: $id
      name: $name
      ovenClean: $ovenClean
      radius: $radius
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
