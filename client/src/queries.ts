import { gql } from 'apollo-boost'

export const queryMyId = gql`
  {
    me {
      id
    }
  }
`
