import { gql } from 'apollo-boost'

export default gql`
  query ProfileService($userId: ID!) {
    services(limit: 1, userId: $userId) {
      nodes {
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
      }
    }
  }
`
