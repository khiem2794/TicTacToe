export default function range(start, end) {
  const a = new Array(end-start+1);
  for (let i = 0; i < end + 1; i++) {
    a[i] = i;
  }
  return a;
}