import { gql } from 'apollo-boost'

export default gql`
  query MyService($userId: ID!) {
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
        imagePath
        name
        ovenClean
        radius
      }
    }
  }
`
