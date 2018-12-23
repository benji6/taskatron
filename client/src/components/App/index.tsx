import { Spinner } from 'eri'
import * as React from 'react'
import { Query } from 'react-apollo'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { queryMyId } from '../../queries'
import Header from '../Header'
import Menu from '../Menu'
import About from '../pages/About'
import AddService from '../pages/AddService'
import AddServiceImage from '../pages/AddServiceImage'
import EditService from '../pages/EditService'
import EditServiceImage from '../pages/EditServiceImage'
import EditUser from '../pages/EditUser'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import PrivateRoute from '../PrivateRoute'

class App extends React.PureComponent {
  public state = {
    isMenuOpen: false,
  }

  public render() {
    const { isMenuOpen } = this.state

    return (
      <Query query={queryMyId}>
        {({ data, error, loading }) => {
          if (loading) return <Spinner variant="page" />
          const isSignedIn = Boolean(!error && data.me.id)

          return (
            <BrowserRouter>
              <>
                <Header onMenuOpen={this.handleMenuOpen} />
                <Menu isOpen={isMenuOpen} onClose={this.handleMenuClose} />
                <main>
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
                      component={EditUser}
                      isSignedIn={isSignedIn}
                    />
                    <PrivateRoute
                      path="/profile/service/add"
                      component={AddService}
                      isSignedIn={isSignedIn}
                    />
                    <PrivateRoute
                      path="/service/:id/image/add"
                      component={AddServiceImage}
                      isSignedIn={isSignedIn}
                    />
                    <PrivateRoute
                      path="/service/:id/image/edit"
                      component={EditServiceImage}
                      isSignedIn={isSignedIn}
                    />
                    <PrivateRoute
                      path="/profile/service/edit"
                      component={EditService}
                      isSignedIn={isSignedIn}
                    />
                    <Redirect to="/" />
                  </Switch>
                </main>
              </>
            </BrowserRouter>
          )
        }}
      </Query>
    )
  }

  private handleMenuClose = () => this.setState({ isMenuOpen: false })
  private handleMenuOpen = () => this.setState({ isMenuOpen: true })
}

export default App
