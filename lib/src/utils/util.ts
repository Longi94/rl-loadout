/**
 * Convenience function to call dispose() on an object if it's not undefined or null.
 * @param object nullable object that must have a dispose method
 */
export function disposeIfExists(object: any) {
  if (object != undefined && object.dispose != undefined) {
    object.dispose();
  }
}

export function mergeSets<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  if (set1 != undefined && set2 != undefined) {
    /* tslint:disable:space-before-function-paren */
    return new Set<T>(function* () {
      yield* set1;
      yield* set2;
    }());
  } else if (set1 != undefined) {
    return set1;
  } else if (set2 != undefined) {
    return set2;
  } else {
    return new Set<T>();
  }
}

export function isPropertyTrue(object, property: string): boolean {
  return object[property];
}
