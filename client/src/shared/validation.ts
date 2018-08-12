const postCodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/

export const isBoolean = (a: any): boolean => typeof a === 'boolean'
export const isString = (a: any): boolean => typeof a === 'string'
export const isDecimal = (n: number): boolean =>
  typeof n === 'number' && String(n).length <= n.toFixed(2).length
export const isValidNumber = (s: string): boolean =>
  Boolean(s) && !Number.isNaN(Number(s))
export const isValidEmail = (s: string): boolean => /.+@.+/.test(s)
export const isValidFirstName = (s: string): boolean => Boolean(s.length)
export const isValidLastName = (s: string): boolean => Boolean(s.length)
export const isValidPostcode = (s: string): boolean => postCodeRegex.test(s)
