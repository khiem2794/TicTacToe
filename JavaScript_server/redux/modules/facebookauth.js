const LOAD = 'fbauth/LOAD';
const LOAD_SUCCESS = 'fbauth/LOAD_SUCCESS';
const LOAD_FAIL = 'fbauth/LOAD_FAIL';
const LOGIN = 'fbauth/LOGIN';
const LOGIN_SUCCESS = 'fbauth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'fbauth/LOGIN_FAIL';
const LOGOUT = 'fbauth/LOGOUT';
const LOGOUT_SUCCESS = 'fbauth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'fbauth/LOGOUT_FAIL';

const initialState = {
  loaded: false,
  loggingIn: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: {
          name: action.result.name,
          fbid: action.result.id
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: {
          name: action.result.name,
          fbid: action.result.id
        }
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.facebookauth && globalState.facebookauth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(code) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login/facebook', {
      data: {
        code: code
      }
    })
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}
