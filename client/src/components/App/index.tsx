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
import Services from '../pages/Services'
import Cleaning from '../pages/Services/Cleaning'
import Gardening from '../pages/Services/Gardening'
import Ironing from '../pages/Services/Ironing'
import Profile from '../pages/Services/Profile'
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
                  path="/services"
                  component={Services}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  exact
                  path="/services/profile"
                  component={Profile}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  path="/services/cleaning"
                  component={Cleaning}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  path="/services/gardening"
                  component={Gardening}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  path="/services/ironing"
                  component={Ironing}
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
