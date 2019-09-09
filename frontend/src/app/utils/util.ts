/**
 * Convenience function to call dispose() on an object if it's not undefined or null.
 * @param object nullable object that must have a dispose method
 */
export function disposeIfExists(object: any) {
  if (object != undefined) {
    object.dispose();
  }
}

/**
 * Copies a text to the clip board
 * @param val rhe text that will be copied to the clipboard
 */
export function copyMessage(val: string) {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

/**
 * Prints to console the amount of milliseconds running the function took.
 * @param name
 * @param timedFunc
 */
export function timed(name: string, timedFunc: () => void) {
  const start = Date.now();
  timedFunc();
  console.debug(`${name} took ${Date.now() - start} milliseconds.`);
}
