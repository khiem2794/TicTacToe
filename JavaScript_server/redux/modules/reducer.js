import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import facebookauth from './facebookauth';
import caro from './caro';
import data from './data';
import spectate from './spectate';

export default combineReducers({
  router: routerStateReducer,
  facebookauth,
  caro,
  data,
  spectate
});
