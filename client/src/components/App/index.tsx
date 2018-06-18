import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { userIsLoadingSelector } from '../../selectors'
import IStore from '../../types/IStore'
import Auth from '../Auth'
import { Spinner } from '../generic'
import Header from '../Header'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'

interface IProps {
  isLoading: boolean
}

class App extends React.PureComponent<IProps> {
  public render() {
    const { isLoading } = this.props

    return (
      <>
        <Auth />
        <BrowserRouter>
          {isLoading ? (
            <Spinner page />
          ) : (
            <>
              <Header />
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/sign-up" component={SignUp} />
            </>
          )}
        </BrowserRouter>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  isLoading: userIsLoadingSelector(state),
})

export default connect(mapStateToProps)(App)
