import * as React from 'react'
import { connect } from 'react-redux'
import { userEmailSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import { Button, Link, Main, Paragraph } from '../../generic'

interface IProps {
  email?: string
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { email } = this.props

    return (
      <>
        <Main>
          <Paragraph>This is home.</Paragraph>
          {email ? (
            <Paragraph>Welcome back {email}!</Paragraph>
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

const mapStateToProps = (state: IStore): IProps => ({
  email: userEmailSelector(state),
})

export default connect(mapStateToProps)(Home)
