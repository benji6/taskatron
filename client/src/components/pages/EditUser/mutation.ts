import { gql } from 'apollo-boost'

export default gql`
  mutation EditUser(
    $firstName: String!
    $lastName: String!
    $postcode: String!
  ) {
    meUpdate(firstName: $firstName, lastName: $lastName, postcode: $postcode) {
      firstName
      lastName
      postcode
    }
  }
`
