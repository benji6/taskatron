import { gql } from 'apollo-boost'

export default gql`
  query GetServiceByUserId($userId: ID!) {
    services(limit: 1, skip: 0, userId: $userId) {
      nodes {
        carpetClean
        deepClean
        description
        general
        hasOwnEquipment
        hasOwnProducts
        hourlyRate
        id
        location {
          coordinates
          type
        }
        name
        ovenClean
        radius
        userId
      }
    }
  }
`
