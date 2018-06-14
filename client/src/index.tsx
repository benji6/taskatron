import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga'
import App from './components/App';
import reducer from './reducers';
import rootSaga from './sagas'

import 'open-color/open-color.css';
import './vars.css';

import './style.css';

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLDivElement
);
