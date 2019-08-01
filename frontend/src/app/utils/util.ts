/**
 * Convenience function to call dispose() on an object if it's not undefined or null.
 *
 * @param object
 */
export function disposeIfExists(object: any) {
  if (object != undefined) {
    object.dispose();
  }
}
