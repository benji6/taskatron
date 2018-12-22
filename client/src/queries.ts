import { gql } from 'apollo-boost'

export const queryMe = gql`
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
