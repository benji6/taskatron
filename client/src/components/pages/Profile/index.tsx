import { gql } from 'apollo-boost'
import { ButtonGroup, Card, Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  userEmailSelector,
  userFirstNameSelector,
  userIdSelector,
  userLastNameSelector,
  userPostcodeSelector,
} from '../../../selectors'
import IStore from '../../../types/IStore'
import ServiceCard from './ServiceCard'

interface IProps {
  email: string
  firstName: string
  lastName: string
  postcode: string
  radius: number
  userId: string
}

export const query = gql`
  query ProfileService($userId: ID!) {
    services(limit: 1, userId: $userId) {
      nodes {
        carpetClean
        deepClean
        description
        general
        hasOwnEquipment
        hasOwnProducts
        hourlyRate
        id
        name
        ovenClean
        radius
      }
    }
  }
`

class Service extends React.PureComponent<IProps> {
  public render() {
    const { email, firstName, userId, lastName, postcode } = this.props

    return (
      <>
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
            <Link className="e-button e-button--primary" to="/profile/user">
              Edit
            </Link>
          </ButtonGroup>
        </Card>
        <Query fetchPolicy="network-only" query={query} variables={{ userId }}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner variation="page" />
            if (error) {
              return (
                <p e-util="negative">
                  Oops, there was an error, please try again.
                </p>
              )
            }

            const [service] = data.services.nodes

            if (!service) {
              return (
                <p e-util="center">
                  <Link to="/profile/service/add">Add a service here</Link>
                </p>
              )
            }

            return <ServiceCard>{service}</ServiceCard>
          }}
        </Query>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  email: userEmailSelector(state) as string,
  firstName: userFirstNameSelector(state) as string,
  lastName: userLastNameSelector(state) as string,
  postcode: userPostcodeSelector(state) as string,
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(Service)
