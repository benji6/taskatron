import { ApolloServer } from 'apollo-server-express'
import pino from '../pino'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

interface IContext {
  userId: string
}

export default new ApolloServer({
  context: async ({ req }: any): Promise<IContext> => ({
    userId: req.user,
  }),
  formatError: (error: Error) => {
    pino.error('Apollo error:', error)
    return error
  },
  formatResponse: (response: object) => {
    pino.info('Apollo response:', response)
    return response
  },
  resolvers,
  typeDefs,
})
