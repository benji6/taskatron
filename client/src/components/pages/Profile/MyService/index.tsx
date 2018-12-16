import { Card, Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userIdSelector } from '../../../../selectors'
import IStore from '../../../../types/IStore'
import query from './query'
import ServiceDetails from './ServiceDetails'
import ServiceImage from './ServiceImage'

interface IProps {
  userId: string
}

const MyService = ({ userId }: IProps) => (
  <Query fetchPolicy="network-only" query={query} variables={{ userId }}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner variation="page" />
      if (error) {
        return (
          <p e-util="negative">Oops, there was an error, please try again.</p>
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

const mapStateToProps = (state: IStore) => ({
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(MyService)
