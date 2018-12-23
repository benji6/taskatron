import { gql } from 'apollo-boost'

export default gql`
  mutation DeleteServiceImage($id: ID!) {
    serviceUpdate(id: $id, imagePath: null) {
      imagePath
    }
  }
`
