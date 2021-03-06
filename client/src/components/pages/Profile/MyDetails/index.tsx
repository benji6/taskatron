import { ButtonGroup, Card, Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import ButtonLink from '../../../ButtonLink'
import query from './query'

const MyDetails = () => (
  <Query query={query}>
    {({ data, error, loading }) => {
      if (loading) return <Spinner variant="page" />
      if (error) {
        return (
          <p e-util="negative">
            Oops, there was an error fetching your user details, please try
            again.
          </p>
        )
      }
      const {
        me: { email, firstName, lastName, postcode },
      } = data
      return (
        <Card>
          <h3>My details</h3>
          <p>These are your personal details and can only be seen by you:</p>
          <ul>
            <li>
              <b>First name:</b> {firstName}
            </li>
            <li>
              <b>Last name:</b> {lastName}
            </li>
            <li>
              <b>Email:</b> {email}
            </li>
            <li>
              <b>Postcode:</b> {postcode}
            </li>
          </ul>
          <ButtonGroup>
            <ButtonLink to="/profile/user">Edit</ButtonLink>
          </ButtonGroup>
        </Card>
      )
    }}
  </Query>
)

export default MyDetails
