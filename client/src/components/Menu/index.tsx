import { Menu as EriMenu } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../actions'

interface IProps {
  isOpen: boolean
  onSignOut: typeof userSignOut
  onClose(): void
}

class Menu extends React.PureComponent<IProps> {
  public render() {
    const { isOpen, onClose, onSignOut } = this.props

    return (
      <EriMenu onClose={onClose} open={isOpen}>
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

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  null,
  mapDispatchToProps,
)(Menu)
