import { gql } from 'apollo-boost'

export default gql`
  {
    me {
      email
      firstName
      id
      lastName
      postcode
    }
  }
`
