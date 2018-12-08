import ApolloClient from 'apollo-boost'
import 'eri/dist/index.css'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { origin } from './api/utils'
import App from './components/App'
import { getCredentials } from './localStorage'
import reducer from './reducers'

const credentials = getCredentials()

const client = new ApolloClient({
  headers: credentials && {
    authorization: `Passwordless ${credentials.token} ${credentials.uid}`,
  },
  uri: `${origin}/graphql`,
})

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
)

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root') as HTMLDivElement,
)
