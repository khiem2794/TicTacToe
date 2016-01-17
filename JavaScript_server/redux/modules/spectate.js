const GET_MATCH = 'spectate/GET_MATCH';
const GET_MATCH_SUCCESS = 'spectate/GET_MATCH_SUCCESS';
const GET_MATCH_FAIL = 'spectate/GET_MATCH_FAIL';
const INIT_SOCKET = 'spectate/INIT_SOCKET';
const START_SPECTATE = 'spectate/START';
const RESPONSE_RECEIVE = 'spectate/RESPONSE_RECEIVE';
const CLOSE_SPECTATE = 'spectate/CLOSE_SPECTATE';

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
        ...state,
        board: action.data.board,
        finish: action.data.finish,
        player: action.data.player,
        roomid: action.data.roomid
      };
    case CLOSE_SPECTATE: {
      return {
        socket: state.socket,
        spectating: false
      };
    }
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
  return {
    type: INIT_SOCKET,
    ws
  };
}

export function startSpectate() {
  return {
    type: START_SPECTATE
  };
}

export function responseHandle(data) {
  return {
    type: RESPONSE_RECEIVE,
    data
  }
}

export function closeSpectate() {
  return {
    type: CLOSE_SPECTATE
  };
}
