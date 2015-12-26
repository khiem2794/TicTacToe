const 
const START = 'caro/START';
const END = 'caro/END';
const CONCEDE = 'caro/CONCEDE';


initialState = {
  start: false
}

export default function caro(state = initialState, action){
  switch (action.type) {
      case START:
        return {
          ...state,
          start: true,
          busy: true
        }
      default:
        return state;
  }
}

export function start() {
  return {
  	type: START
  }
}