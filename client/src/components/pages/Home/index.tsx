import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../../actions'
import { userFirstNameSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import Search from './Search'

interface IProps {
  firstName: string | undefined
  onSignOut: typeof userSignOut
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { firstName, onSignOut } = this.props

    return (
      <main>
        <h2>Welcome</h2>
        {firstName ? (
          <>
            <p>Hi {firstName}!</p>
            <ButtonGroup>
              <Link to="/profile">Manage profile</Link>
              <Button onClick={onSignOut} variant="secondary">
                Sign out
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <ButtonGroup>
            <Button to="sign-up">Join us!</Button>
            <Button to="sign-in" variant="secondary">
              Sign in
            </Button>
          </ButtonGroup>
        )}
        <Search />
      </main>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state),
})

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
