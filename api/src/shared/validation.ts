export const isValidEmail = (s: string): boolean => /.+@.+/.test(s)
export const isValidFirstName = (s: string): boolean => Boolean(s.length)
export const isValidLastName = (s: string): boolean => Boolean(s.length)
export const isValidPostcode = (s: string): boolean => Boolean(s.length)
