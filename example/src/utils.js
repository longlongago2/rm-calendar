export function prefixInteger(num, length = 2) {
  return (Array(length).join('0') + num).slice(-length);
}

export function name() {
  return 'utils';
}
