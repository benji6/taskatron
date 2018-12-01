export const isValidNumber = (s: string): boolean =>
  Boolean(s) && !Number.isNaN(Number(s))
