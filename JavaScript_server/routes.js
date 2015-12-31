import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { isLoaded as isFBAuthLoaded, load as loadFBAuth } from 'redux/modules/facebookauth';
import {
    App,
    Chat,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
    Todo,
    CaroApp,
    CaroHomepage,
    FacebookAuthCallBack,
    Landing,
    Ranking,
    Overview,
    Profile,
    Spectate,
    Caro
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  const notLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { facebookauth: { user }} = store.getState();
      if (user) {
        replaceState(null, '/');
      }
      cb();
    }
    if (!isFBAuthLoaded(store.getState())) {
      store.dispatch(loadFBAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  const toLanding = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { facebookauth: { user }} = store.getState();
      if (!user) {
        replaceState(null, '/landing');
      }
      cb();
    }
    if (!isFBAuthLoaded(store.getState())) {
      store.dispatch(loadFBAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={CaroApp}>
      <Route onEnter={toLanding}>
        <IndexRoute component={CaroHomepage}/>
        <Route path='/overview' component={Overview} />
        <Route path='/profile' component={Profile} />
        <Route path='/ranking' component={Ranking} />
        <Route path='/spectate' component={Spectate} />
        <Route path='/caro' component={Caro} />
      </Route>
      <Route onEnter={notLogin}>
        <Route path="landing" component={Landing}/>
        <Route path="auth/facebook/callback" component={FacebookAuthCallBack}/>
      </Route>
      <Route path="old" component={App}>
        <IndexRoute component={Home}/>
        { /* Routes requiring login */ }
        <Route onEnter={requireLogin}>
          <Route path="chat" component={Chat}/>
          <Route path="loginSuccess" component={LoginSuccess}/>
        </Route>
        { /* Routes */ }
        <Route path="about" component={About}/>
        <Route path="login" component={Login}/>
        <Route path="survey" component={Survey}/>
        <Route path="widgets" component={Widgets}/>
        <Route path="todo" component={Todo}/>
        { /* Catch all route */ }
      </Route>

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
