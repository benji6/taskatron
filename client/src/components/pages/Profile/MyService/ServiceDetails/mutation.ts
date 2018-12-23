import { gql } from 'apollo-boost'

export default gql`
  mutation DeleteService($id: ID!) {
    serviceDelete(id: $id) {
      id
    }
  }
`
