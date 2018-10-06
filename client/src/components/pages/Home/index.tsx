import { Button, ButtonGroup } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { userFirstNameSelector } from '../../../selectors'
import IStore from '../../../types/IStore'
import Search from './Search'

interface IProps {
  firstName?: string
}

class Home extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { firstName } = this.props

    return (
      <main>
        {!firstName && (
          <>
            <ButtonGroup>
              <Button to="sign-up">Join us!</Button>
              <Button to="sign-in" variant="secondary">
                Sign in
              </Button>
            </ButtonGroup>
          </>
        )}
        <Search />
      </main>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  firstName: userFirstNameSelector(state),
})

export default connect(mapStateToProps)(Home)
