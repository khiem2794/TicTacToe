export default function range(start, end) {
  const arr = new Array(end - start + 1);
  for (let point = 0; point < end + 1; point++) {
    arr[point] = point;
  }
  return arr;
}
