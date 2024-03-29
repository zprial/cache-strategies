export default function sleep(ms = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined)
    }, ms);
  });
}