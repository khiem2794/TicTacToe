const ACTION_STARTING = 'start';
const ACTION_MOVE = 'move';

export function startMSG(){
  return {
  	message: ACTION_STARTING
  }
}

export function moveMSG(x, y){
  return {
  	message: ACTION_MOVE,
  	cell: {
  	  x: x,
  	  y: y
  	}
  }
}
