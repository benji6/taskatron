import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga'
import Home from './components/Home';
import SignIn from './components/SignIn';
import reducer from './reducers';
import rootSaga from './sagas'

import './vars.css';

import './style.css';

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <>
        <Route path="/" exact component={Home}/>
        <Route path="/sign-in" component={SignIn}/>
      </>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLDivElement
);

sagaMiddleware.run(rootSaga)
