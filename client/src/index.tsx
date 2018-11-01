import ApolloClient from 'apollo-boost'
import 'eri/dist/index.css'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { origin } from './api/utils'
import App from './components/App'
import reducer from './reducers'
import rootSaga from './sagas'

const client = new ApolloClient({
  uri: `${origin}/graphql`,
})

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root') as HTMLDivElement,
)
