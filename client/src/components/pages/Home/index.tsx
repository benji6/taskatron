import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
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
        <h2>Welcome</h2>
        {firstName ? (
          <>
            <p>Hi {firstName}!</p>
            <ButtonGroup>
              <Button to="/services">Manage your services</Button>
              <Button onClick={onSignOut} variant="secondary">
                Sign out
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <ButtonGroup>
            <Button to="sign-up">Join us!</Button>
            <Button to="sign-in">Sign in</Button>
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
