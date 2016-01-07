const WAIT_RESPONSE = 'wait';
const READY_RESPONSE = 'ready';
const BOARD_RESPONSE = 'board';
const END_RESPONSE = 'end';

export default function ResponseType(res, actions) {
  const { wait, ready, change, end } = actions;
  if (res.response === WAIT_RESPONSE) {
    wait();
  }
  if (res.response === READY_RESPONSE) {
    ready(res);
  }
  if (res.response === BOARD_RESPONSE) {
    change(res);
  }
  if (res.response === END_RESPONSE) {
    end(res);
  }
}
