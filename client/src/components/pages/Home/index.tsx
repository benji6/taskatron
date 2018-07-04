import * as React from 'react'
import { connect } from 'react-redux'
import { userSignOut } from '../../../actions'
import { userEmailSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import { Button, Link, Main, Paragraph } from '../../generic'

interface IProps {
  readonly email: string | undefined
  readonly onSignOut: typeof userSignOut
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { email, onSignOut } = this.props

    return (
      <>
        <Main>
          <Paragraph>This is home.</Paragraph>
          {email ? (
            <>
              <Paragraph>Welcome back {email}!</Paragraph>
              <Button onClick={onSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="sign-up">
                <Button>Join us!</Button>
              </Link>
              <br />
              <br />
              <br />
              <Link to="sign-in">
                <Button>Sign in</Button>
              </Link>
            </>
          )}
        </Main>
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
