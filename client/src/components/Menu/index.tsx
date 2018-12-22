import { Menu as EriMenu } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { getSignOut } from '../../api'
import { deleteCredentials } from '../../localStorage'
import query from './query'

interface IProps {
  isOpen: boolean
  onClose(): void
}

class Menu extends React.PureComponent<IProps> {
  public render() {
    const { isOpen, onClose } = this.props

    return (
      <Query query={query}>
        {({ error, data, loading }) => {
          if (error || loading) return null
          const { firstName } = data.me
          return (
            <EriMenu onClose={onClose} open={isOpen}>
              <p>Hi {firstName}!</p>
              <hr />
              <p>
                <Link onClick={onClose} to="/">
                  Home
                </Link>
              </p>
              <p>
                <Link onClick={onClose} to="/profile">
                  Manage profile
                </Link>
              </p>
              <p>
                <Link onClick={onClose} to="/about">
                  About
                </Link>
              </p>
              <p>
                <Link onClick={this.handleSignOut} to="/">
                  Sign out
                </Link>
              </p>
            </EriMenu>
          )
        }}
      </Query>
    )
  }

  private handleSignOut = async () => {
    const { onClose } = this.props
    onClose()

    try {
      await getSignOut()
    } catch {
      // empty
    }

    deleteCredentials()

    // TODO - to remove will need to remove auth header from
    // Apollo Client and clear the Apollo Client cache
    window.location.href = '/'
  }
}

export default Menu
