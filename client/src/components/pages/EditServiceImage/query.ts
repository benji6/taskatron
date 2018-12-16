import { gql } from 'apollo-boost'

export default gql`
  query ServiceById($id: ID!) {
    service(id: $id) {
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
      userId
    }
  }
`
