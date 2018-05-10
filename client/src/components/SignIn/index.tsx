import * as React from 'react';
import {
  Button,
  Heading,
  Main,
  TextField
} from '../generic'

class SignIn extends React.PureComponent {
  public render () {
    return (
      <Main>
        <form>
          <Heading variation="h2">Sign in</Heading>
          <p>Send us your email address and we'll send you a secure link to sign in with.</p>
          <TextField>Email</TextField>
          <Button>Send link</Button>
        </form>
      </Main>
    )
  }
}

export default SignIn
