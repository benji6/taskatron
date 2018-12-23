import { Card, Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { getUserId } from '../../../../localStorage'
import query from './query'
import ServiceDetails from './ServiceDetails'
import ServiceImage from './ServiceImage'

const MyService = () => {
  const userId = getUserId() as string

  return (
    <Query fetchPolicy="network-only" query={query} variables={{ userId }}>
      {({ loading, error, data }) => {
        if (loading) return <Spinner variant="page" />
        if (error) {
          return (
            <p e-util="negative">
              Oops, there was an error fetching the details of your service,
              please try again.
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

        return (
          <Card>
            <h3>My Service</h3>
            <p>
              These are the details of your service that people can view and
              search for
            </p>
            <ServiceImage
              id={service.id}
              imagePath={service.imagePath}
              userId={userId}
            />
            <ServiceDetails>{service}</ServiceDetails>
          </Card>
        )
      }}
    </Query>
  )
}

export default MyService
