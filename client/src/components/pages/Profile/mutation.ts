import { gql } from 'apollo-boost'

export default gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
    }
  }
`
