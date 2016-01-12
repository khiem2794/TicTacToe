const LOAD_PROFILE = 'data/LOAD_PROFILE';
const LOAD_PROFILE_FAIL = 'data/LOAD_PROFILE_FAIL';
const LOAD_PROFILE_SUCCESS = 'data/LOAD_PROFILE_SUCCESS';
const LOAD_RANK = 'data/LOAD_RANK';
const LOAD_RANK_FAIL = 'data/LOAD_RANK_FAIL';
const LOAD_RANK_SUCCESS = 'data/LOAD_RANK_SUCCESS';

const initialState = {
  profile: null
}

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
  	case LOAD_PROFILE:
  	  return {
  	  	...state
  	  };
  	case LOAD_PROFILE_SUCCESS:
  	  return {
  	  	...state,
  	  	profile: action.data
  	  };
  	case LOAD_PROFILE_FAIL:
  	  return {
  	  	...state
  	  };
  	case LOAD_RANK:
  	  return {
  	  	...state
  	  };
  	case LOAD_RANK_FAIL:
  	  return {
  	  	...state
  	  };
  	case LOAD_RANK_SUCCESS:
  	  return {
  	  	...state
  	  };
  	default:
  	  return state;
  }
}

export function loadProfile(fbid) {
  console.log(`get profile ${fbid}`);
  return {
  	types: [LOAD_PROFILE, LOAD_PROFILE_SUCCESS, LOAD_PROFILE_FAIL],
  	promise: (client) => client.get(`/api/${fbid}`)
  }
}

export function loadRank() {
  return {
  	types: [LOAD_RANK, LOAD_RANK_SUCCESS, LOAD_RANK_FAIL],
  	promise: (client) => client.get('/rank')
  }
}