/**
 * Same as Promise.all() but with a progress callback
 *
 * @param promises
 * @param progressCallback
 */
export function promiseProgress(promises, progressCallback): Promise<any[]> {
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
