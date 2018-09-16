import pino from './pino'

export default (resource: string) => (
  method: 'GET' | 'DELETE' | 'PATCH' | 'POST' | 'PUT',
) => (...args: Array<unknown>): void => {
  const [status, msg] = args as [string, unknown]
  if (args.length === 1) pino.error(`${method} ${resource} ${status}`)
  else pino.error(`${method} ${resource} ${status}`, msg)
}
