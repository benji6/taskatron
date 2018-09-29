import { Spinner } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { userIsLoadingSelector, userIsSignedInSelector } from '../../selectors'
import IStore from '../../types/IStore'
import Auth from '../Auth'
import Header from '../Header'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Services from '../pages/Service'
import Profile from '../pages/Service/Profile'
import ServiceForm from '../pages/ServiceForm'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import PrivateRoute from '../PrivateRoute'

interface IProps {
  isLoading: boolean
  isSignedIn: boolean
}

class App extends React.PureComponent<IProps> {
  public render() {
    const { isLoading, isSignedIn } = this.props

    return (
      <>
        <Auth />
        <BrowserRouter>
          {isLoading ? (
            <Spinner variation="page" />
          ) : (
            <>
              <Header />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-up" component={SignUp} />
                <PrivateRoute
                  exact
                  path="/profile"
                  component={Services}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  exact
                  path="/profile/user"
                  component={Profile}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  path="/profile/service"
                  component={ServiceForm}
                  isSignedIn={isSignedIn}
                />
                <Redirect to="/" />
              </Switch>
            </>
          )}
        </BrowserRouter>
      </>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  isLoading: userIsLoadingSelector(state),
  isSignedIn: userIsSignedInSelector(state),
})

export default connect(mapStateToProps)(App)
