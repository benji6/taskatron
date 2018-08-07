import { Spinner } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { userIsLoadingSelector, userIsSignedInSelector } from '../../selectors'
import IStore from '../../types/IStore'
import Auth from '../Auth'
import Header from '../Header'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Cleaning from '../pages/Services/Cleaning'
import Gardening from '../pages/Services/Gardening'
import Ironing from '../pages/Services/Ironing'
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
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/sign-in" component={SignIn} />
              <Route path="/sign-up" component={SignUp} />
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
