import { Button } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { userSignOut } from '../../../actions'
import { userEmailSelector } from '../../../selectors'
import IStore from '../../../types/IStore'

interface IProps {
  readonly email: string | undefined
  readonly onSignOut: typeof userSignOut
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { email, onSignOut } = this.props

    return (
      <>
        <main>
          <p>This is home.</p>
          {email ? (
            <>
              <p>Welcome back {email}!</p>
              <Button onClick={onSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="sign-up">
                <Button>Join us!</Button>
              </Link>
              <Link to="sign-in">
                <Button>Sign in</Button>
              </Link>
            </>
          )}
        </main>
      </>
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
