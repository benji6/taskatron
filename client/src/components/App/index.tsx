import { Spinner } from 'eri'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { userIsLoadingSelector, userIsSignedInSelector } from '../../selectors'
import IStore from '../../types/IStore'
import Auth from '../Auth'
import Header from '../Header'
import Menu from '../Menu'
import About from '../pages/About'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import ServiceForm from '../pages/ServiceForm'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import UserForm from '../pages/UserForm'
import PrivateRoute from '../PrivateRoute'

interface IProps {
  isLoading: boolean
  isSignedIn: boolean
}

class App extends React.PureComponent<IProps> {
  public state = {
    isMenuOpen: false,
  }

  public render() {
    const { isLoading, isSignedIn } = this.props
    const { isMenuOpen } = this.state

    return (
      <>
        <Auth />
        <BrowserRouter>
          {isLoading ? (
            <Spinner variation="page" />
          ) : (
            <>
              <Header onMenuOpen={this.handleMenuOpen} />
              <Menu isOpen={isMenuOpen} onClose={this.handleMenuClose} />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/sign-in" component={SignIn} />
                <Route path="/sign-up" component={SignUp} />
                <PrivateRoute
                  exact
                  path="/profile"
                  component={Profile}
                  isSignedIn={isSignedIn}
                />
                <PrivateRoute
                  exact
                  path="/profile/user"
                  component={UserForm}
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

  private handleMenuClose = () => this.setState({ isMenuOpen: false })
  private handleMenuOpen = () => this.setState({ isMenuOpen: true })
}

const mapStateToProps = (state: IStore) => ({
  isLoading: userIsLoadingSelector(state),
  isSignedIn: userIsSignedInSelector(state),
})

export default connect(mapStateToProps)(App)
