import { gql } from 'apollo-boost'

export default gql`
  mutation AddServiceImage($id: ID!, $imagePath: String) {
    serviceUpdate(id: $id, imagePath: $imagePath) {
      imagePath
    }
  }
`
