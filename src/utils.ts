// export const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

export function has<T, K extends Extract<keyof T, PropertyKey>, U = T[K]>(obj: T, prop: K): obj is T & Record<K, U> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
