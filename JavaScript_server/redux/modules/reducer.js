import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import facebookauth from './facebookauth';
import caro from './caro';

export default combineReducers({
  router: routerStateReducer,
  facebookauth,
  caro
});
