import { Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userIdSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import MyDetails from './MyDetails'
import MyService from './MyService'
import query from './query'

interface IProps {
  radius: number
  userId: string
}

class Service extends React.PureComponent<IProps> {
  public render() {
    const { userId } = this.props

    return (
      <>
        <MyDetails />
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

            return <MyService>{service}</MyService>
          }}
        </Query>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  userId: userIdSelector(state) as string,
})

export default connect(mapStateToProps)(Service)
