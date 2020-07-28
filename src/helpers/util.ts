const toString = Object.prototype.toString

/**
 * 这里用到了 TypeScript 类型保护的知识点
 */

export function isDate (val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject (val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// export function isObject (val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

// 用到了 TS 交叉类型和类型断言的知识点
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}