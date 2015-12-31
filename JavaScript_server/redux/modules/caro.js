const ACTION_CONNECT = 'caro/CONNECT';
const ACTION_WAIT = 'caro/WAIT';
const ACTION_INIT = 'caro/INIT';
const ACTION_CHANGE = 'caro/CHANGE';
const ACTION_END = 'caro/END';

const initialState = {
  playing: false,
  waiting: false,
  socket: null
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
export function init() {
  return {
  	type: ACTION_INIT
  }
}

export function change() {
  return {
    type: ACTION_CHANGE
  }
}

export function end() {
  return {
  	type: ACTION_END
  }
}
