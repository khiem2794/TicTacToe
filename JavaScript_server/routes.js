import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isFBAuthLoaded, load as loadFBAuth } from 'redux/modules/facebookauth';
import {
    NotFound,
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

      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
