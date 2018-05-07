import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {BrowserRouter, Route} from 'react-router-dom';
import {createStore} from 'redux';
import Header from './components/Header';
import Home from './components/Home';
import SignIn from './components/SignIn';
import reducer from './reducers';

import './vars.css';

import './index.css';

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <>
        <Header />
        <Route path="/" exact component={Home}/>
        <Route path="/sign-in" component={SignIn}/>
      </>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLDivElement
);
