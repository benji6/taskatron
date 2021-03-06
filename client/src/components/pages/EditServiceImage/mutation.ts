import { gql } from 'apollo-boost'

export default gql`
  mutation EditServiceImage($id: ID!, $imagePath: String) {
    serviceUpdate(id: $id, imagePath: $imagePath) {
      imagePath
    }
  }
`
