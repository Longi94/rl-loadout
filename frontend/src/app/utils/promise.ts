/**
 * Same as Promise.all() but with a progress callback
 * @param promises list of promises
 * @param progressCallback callback function that will be called on each finished promise
 */
export function promiseProgress(promises: Promise<any>[], progressCallback: (d: number) => void): Promise<any[]> {
  let d = 0;
  progressCallback(0);
  for (const p of promises) {
    p.then(() => {
      d++;
      progressCallback(d);
    });
  }
  return Promise.all(promises);
}
