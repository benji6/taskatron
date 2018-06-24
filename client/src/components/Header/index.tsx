import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../actions'
import { userIsSignedInSelector } from '../../selectors'
import IStore from '../../types/IStore'
import { Button } from '../generic'
import './style.css'

interface IProps {
  readonly isSignedIn: boolean
  readonly onSignOut: typeof userSignOut
}

class Header extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { isSignedIn, onSignOut } = this.props

    return (
      <header className="header">
        <h1 className="header__heading">
          <Link className="header__heading-link" to="/">
            Taskatron
          </Link>
        </h1>
        <div className="header__profile">
          {isSignedIn ? (
            <Button onClick={onSignOut}>Sign out</Button>
          ) : (
            <Link to="sign-in">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
        <div className="header__sign-up">
          {!isSignedIn && (
            <Link to="sign-up">
              <Button>Join us</Button>
            </Link>
          )}
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  isSignedIn: userIsSignedInSelector(state),
})

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
