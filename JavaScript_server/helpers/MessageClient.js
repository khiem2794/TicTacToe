const ACTION_STARTING = 'start';
const ACTION_MOVE = 'move';

export function startMSG() {
  return {
    message: ACTION_STARTING
  };
}

export function moveMSG(px, py) {
  return {
    message: ACTION_MOVE,
    cell: {
      x: px,
      y: py
    }
  };
}
