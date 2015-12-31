const WAIT_RESPONSE = 'wait';

export default function ResponseType(res, actions) {
  const { wait } = actions;
  if (res.response === WAIT_RESPONSE) {
  	wait();
  }
}
