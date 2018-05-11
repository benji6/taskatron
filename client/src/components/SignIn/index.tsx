import * as React from 'react';
import {
  Button,
  Heading,
  Main,
  TextField
} from '../generic'

interface IState {
  email: string
  error: boolean
}

class SignIn extends React.PureComponent<React.ReactPropTypes, IState> {
  constructor (props: React.ReactPropTypes) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      email: '',
      error: false
    }
  }

  public render (): React.ReactNode {
    const {error} = this.state

    return (
      <Main>
        <form onSubmit={this.handleSubmit}>
          <Heading variation="h2">Sign in</Heading>
          <p>Send us your email address and we'll send you a secure link to sign in with.</p>
          <TextField error={error ? 'Please enter a valid email address' : undefined} onChange={this.handleChange}>
            Email
          </TextField>
          {error && "there was an error"}
          <Button>Send link</Button>
        </form>
      </Main>
    )
  }

  private handleChange(e: any): void {
    this.setState({email: e.target.value})
  }

  private handleSubmit (e: any): void {
    e.preventDefault()

    const {email} = this.state

    if (/.+@.+/.test(email)) {
      this.setState({error: false})
      return
    }

    this.setState({error: true})
  }
}

export default SignIn
