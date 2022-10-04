/**
 * remove undefined values from an object
 */
export function removeUndefined(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined ? delete obj[key] : {}
  );
}

/**
 * omit values from an object
 */
export function omit<T extends Record<string, any>>(
  obj: T,
  omit: (keyof T)[]
): T {
  const o = obj;
  Object.keys(o).forEach((key) => omit.includes(key) && delete o[key]);
  return o;
}

/**
 * pick values from an object
 */
export function pick<T extends Record<string, any>>(
  obj: T,
  pick: (keyof T)[]
): T {
  const o = obj;
  Object.keys(o).forEach((key) => !pick.includes(key) && delete o[key]);
  return o;
}
