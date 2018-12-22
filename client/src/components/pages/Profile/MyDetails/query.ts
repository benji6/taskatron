import { gql } from 'apollo-boost'

export default gql`
  {
    me {
      email
      firstName
      lastName
      postcode
    }
  }
`
