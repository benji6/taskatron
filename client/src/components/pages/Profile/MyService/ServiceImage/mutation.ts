import { gql } from 'apollo-boost'

export default gql`
  mutation DeleteServiceImage($id: ID!) {
    updateService(id: $id, imagePath: null) {
      imagePath
    }
  }
`
