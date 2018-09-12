export const parseBooleanQuery = (
  a: string | undefined,
): boolean | undefined => {
  if (a === undefined) return undefined
  if (a === 'false') return false
  return Boolean(a)
}
