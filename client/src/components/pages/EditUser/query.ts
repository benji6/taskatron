import { gql } from 'apollo-boost'

export default gql`
  {
    me {
      firstName
      lastName
      postcode
    }
  }
`
