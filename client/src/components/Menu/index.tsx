import { Menu as EriMenu } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../actions'
import { userFirstNameSelector } from '../../selectors'
import IStore from '../../types/IStore'

interface IProps {
  firstName: string
  isOpen: boolean
  onSignOut: typeof userSignOut
  onClose(): void
}

class Menu extends React.PureComponent<IProps> {
  public render() {
    const { firstName, isOpen, onClose, onSignOut } = this.props

    return (
      <EriMenu onClose={onClose} open={isOpen}>
        <p>Hi {firstName}!</p>
        <hr />
        <p>
          <Link onClick={onClose} to="/">
            Find a cleaner
          </Link>
        </p>
        <p>
          <Link onClick={onClose} to="/profile">
            Manage profile
          </Link>
        </p>
        <p>
          <Link
            onClick={() => {
              onClose()
              onSignOut()
            }}
            to="/"
          >
            Sign out
          </Link>
        </p>
      </EriMenu>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state) as string,
})

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu)
