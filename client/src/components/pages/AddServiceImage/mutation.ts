import { gql } from 'apollo-boost'

export default gql`
  mutation AddServiceImage($id: ID!, $imagePath: String) {
    updateService(id: $id, imagePath: $imagePath) {
      imagePath
    }
  }
`
