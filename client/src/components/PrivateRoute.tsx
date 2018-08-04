import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface IProps extends RouteProps {
  component: React.ComponentType<any>
  isSignedIn: boolean
}

class PrivateRoute extends React.Component<IProps> {
  public render() {
    const { component: Component, isSignedIn, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props =>
          isSignedIn ? <Component {...props} /> : <Redirect to="/sign-in" />
        }
      />
    )
  }
}

export default PrivateRoute
