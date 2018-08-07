import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../../actions'
import { userEmailSelector } from '../../../selectors'
import IStore from '../../../types/IStore'

interface IProps {
  email: string | undefined
  onSignOut: typeof userSignOut
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { email, onSignOut } = this.props

    return (
      <main>
        {email ? (
          <>
            <p>Welcome back {email}!</p>
            <p>
              Tell us what service you have to offer -{' '}
              <Link to="/services/cleaning">cleaning</Link>,{' '}
              <Link to="/services/gardening">gardening</Link>, or{' '}
              <Link to="/services/ironing">ironing</Link>.
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
  email: userEmailSelector(state),
})

const mapDispatchToProps = {
  onSignOut: userSignOut,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
