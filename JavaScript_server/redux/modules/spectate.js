const GET_MATCH = 'spectate/GET_MATCH';
const GET_MATCH_SUCCESS = 'spectate/GET_MATCH_SUCCESS';
const GET_MATCH_FAIL = 'spectate/GET_MATCH_FAIL';
const INIT_SOCKET = 'spectate/INIT_SOCKET';
const START_SPECTATE = 'spectate/START';
const RESPONSE_RECEIVE = 'spectate/RESPONSE_RECEIVE';

const initialState = {
  spectating: false,
  socket: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_MATCH:
      return {
        ...state
      };
    case GET_MATCH_SUCCESS:
      return {
        ...state,
        matches: action.result.matches
      };
    case GET_MATCH_FAIL:
      return {
        ...state
      };
    case INIT_SOCKET:
      return {
        ...state,
        socket: action.ws
      };
    case START_SPECTATE:
      return {
        ...state,
        spectating: true
      };
    case RESPONSE_RECEIVE:
      return {
        ...state
      };
    default:
      return state;
  }
}

export function getMatch() {
  return {
    types: [GET_MATCH, GET_MATCH_SUCCESS, GET_MATCH_FAIL],
    promise: (client) => client.get('/matches')
  };
}

export function initSocket(ws) {
  console.log('init socket spectate');
  return {
    type: INIT_SOCKET,
    ws
  };
}

export function startSpectate() {
  console.log('begin spectate');
  return {
    type: START_SPECTATE
  };
}

export function responseHandle(data) {
  console.log('handle', data);
  return {
    type: RESPONSE_RECEIVE,
    data
  }
}
