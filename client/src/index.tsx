import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga'
import Auth from './components/Auth';
import Header from './components/Header';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';
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

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <>
        <Header />
        <Route path="/" component={Auth}/>
        <Route path="/" exact component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/sign-in" component={SignIn}/>
        <Route path="/sign-up" component={SignUp}/>
      </>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLDivElement
);
