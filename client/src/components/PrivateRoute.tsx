import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface IProps extends RouteProps {
  component: React.ComponentType<any>
  isSignedIn: boolean
}

export default function PrivateRoute({
  component: Component,
  isSignedIn,
  ...rest
}: IProps) {
  return (
    <Route
      {...rest}
      render={props =>
        isSignedIn ? <Component {...props} /> : <Redirect to="/sign-in" />
      }
    />
  )
}
