import * as React from 'react';
import {Redirect} from 'react-router-dom'
import {getMe} from '../../../api'
import {setCredentials} from '../../../localStorage'
import { IUserRecord } from '../../../shared/types';
import {
  Heading,
  Link,
  Main,
  Paragraph,
  Spinner,
} from '../../generic';

type IProps = any

interface IState {
  error: boolean
  redirect: boolean
}

class Login extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      error: false,
      redirect: false,
    }
  }
  public componentDidMount() {
    const params = new URL(String(document.location)).searchParams

    const token = params.get('token')
    const uid = params.get('uid')

    // we need to figure out whether they are valid before we save them

    if (token && uid) {
      const credentials = {token, uid}
      getMe({token, uid})
        .then((user: IUserRecord) => {
          setCredentials(credentials)
          // FIXME classic setState on unmounted component issue
          this.setState({redirect: true})
        })
        .catch(() => {
          this.setState({error: true})
        })
    }
  }

  public render () {
    if (this.state.redirect) return <Redirect to="/"/>
    if (this.state.error) {
      return (
        <Main>
          <Heading variation="h2">Error Signing In</Heading>
          <Paragraph><Link to="sign-in">Click here</Link> to get a new token and remember that old tokens may no longer work.</Paragraph>
        </Main>
      )
    }
    return <Spinner page />
  }
}

export default Login
