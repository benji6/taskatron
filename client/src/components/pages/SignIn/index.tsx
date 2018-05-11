import * as React from 'react';
import {connect} from 'react-redux'
import {authSignInRequest} from '../../../actions'
import {isRequestingSignInSelector} from '../../../selectors'
import IStore from '../../../types/IStore';
import {
  Button,
  Heading,
  Main,
  TextField
} from '../../generic'

interface IProps {
  isRequesting: boolean
  signIn: typeof authSignInRequest
}

interface IState {
  email: string
  error: boolean
}

class SignIn extends React.PureComponent<IProps, IState> {
  constructor (props: IProps) {
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
    const {isRequesting} = this.props

    return (
      <Main>
        <form onSubmit={this.handleSubmit} noValidate>
          <Heading variation="h2">Sign in</Heading>
          <p>Send us your email address and we'll send you a secure link to sign in with.</p>
          <TextField error={error ? 'Please enter a valid email address' : undefined} onChange={this.handleChange} type="email">
            Email
          </TextField>
          <Button disabled={isRequesting}>Send link</Button>
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
    const {signIn} = this.props

    if (/.+@.+/.test(email)) {
      this.setState({error: false})
      signIn(email)
      return
    }

    this.setState({error: true})
  }
}

const mapStateToProps = (state: IStore) => ({
  isRequesting: isRequestingSignInSelector(state)
})

const mapDispatchToProps = {
  signIn: authSignInRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
