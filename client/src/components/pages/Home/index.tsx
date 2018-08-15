import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../../actions'
import { userFirstNameSelector } from '../../../selectors'
import IStore from '../../../types/IStore'

interface IProps {
  firstName: string | undefined
  onSignOut: typeof userSignOut
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { firstName, onSignOut } = this.props

    return (
      <main>
        {firstName ? (
          <>
            <h2>Welcome</h2>
            <p>Hi {firstName}!</p>
            <p e-util="center">
              <Link to="/services">Manage your services</Link>
            </p>
            <ButtonGroup>
              <Button onClick={onSignOut}>Sign out</Button>
            </ButtonGroup>
          </>
        ) : (
          <ButtonGroup>
            <Link to="sign-up">
              <Button>Join us!</Button>
            </Link>
            <Link to="sign-in">
              <Button>Sign in</Button>
            </Link>
          </ButtonGroup>
        )}
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
