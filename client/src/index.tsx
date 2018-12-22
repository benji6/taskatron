import ApolloClient from 'apollo-boost'
import 'eri/dist/index.css'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import { origin } from './api/utils'
import App from './components/App'
import { getCredentials } from './localStorage'

const credentials = getCredentials()

const client = new ApolloClient({
  headers: credentials && {
    authorization: `Passwordless ${credentials.token} ${credentials.uid}`,
  },
  uri: `${origin}/graphql`,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLDivElement,
)
