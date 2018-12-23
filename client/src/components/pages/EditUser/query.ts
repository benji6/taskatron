import { gql } from 'apollo-boost'

export default gql`
  {
    me {
      firstName
      id
      lastName
      postcode
    }
  }
`
