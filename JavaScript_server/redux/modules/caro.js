const ACTION_CONNECT = 'caro/CONNECT';
const ACTION_WAIT = 'caro/WAIT';
const ACTION_READY = 'caro/READY';
const ACTION_CHANGE = 'caro/CHANGE';
const ACTION_END = 'caro/END';
const ACTION_RESTART = 'caro/RESTART';

const initialState = {
  playing: false,
  waiting: false,
  socket: null,
  result: false
}

export default function caro(state = initialState, action){
  switch (action.type) {
      case ACTION_WAIT:
        return {
          ...state,
          playing: true,
          waiting: true
        }
      case ACTION_CONNECT:
        return {
          ...state,
          socket: action.ws
        }
      case ACTION_READY:
        return {
          ...state,
          playing: true,
          waiting: false,
          opponent: action.opponent,
          yourturn: action.yourturn,
          symbol: action.symbol,
          board: {
          	size: action.board.size,
          	x: [],
          	o: [],
          	turn: action.board.turn
          }
        }
      case ACTION_CHANGE:
        return {
          ...state,
          yourturn: action.yourturn,
          board: {
          	...state.board,
          	turn: action.board.turn,
          	x: action.board.x,
          	o: action.board.o
          }
        }
      case ACTION_END:
        console.log(action);
        return {
          ...state,
          yourturn: false,
          board: {
            ...state.board,
            turn: action.board.turn,
            x: action.board.x,
            o: action.board.o
          },
          result: true,
          win: action.result
        }
      case ACTION_RESTART:
        return {
          playing: false,
          waiting: false,
          result: false,
          socket: state.socket
        }
      default:
        return state;
  }
}

export function initSocket(ws) {
	return {
	  type: ACTION_CONNECT,
	  ws
	}
}

export function wait() {
  console.log("waiting");
  return {
  	type: ACTION_WAIT
  }
}
export function ready(res) {
  return {
  	type: ACTION_READY,
  	opponent: res.opponent,
  	yourturn: res.yourturn,
  	symbol: res.symbol,
  	board: res.board
  }
}

export function change(res) {
  return {
    type: ACTION_CHANGE,
    yourturn: res.yourturn,
    board: res.board
  }
}

export function end(res) {
  return {
  	type: ACTION_END,
    result: res.result === 'win',
    board: res.board
  }
}

export function restart() {
  return {
    type: ACTION_RESTART
  }
}