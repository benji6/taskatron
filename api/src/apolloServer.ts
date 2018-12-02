import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express'
import {
  maxServiceDescriptionLength,
  maxServiceNameLength,
} from 'shared/constants'
import { IUserDocument } from 'shared/types'
import {
  addService,
  countServices,
  deleteService,
  getService,
  getServiceByUserId,
  searchServices,
  updateService,
} from './model/services'
import { getUser } from './model/user'
import pino from './pino'
import typeDefs from './typeDefs'

interface IContext {
  userId: string
}

const resolvers = {
  Mutation: {
    addService: async (_: unknown, args: any, context: IContext) => {
      if (args.userId !== context.userId) {
        throw new AuthenticationError('authed user does not match record user')
      }

      if (await getServiceByUserId(args.userId)) {
        throw new UserInputError('record already exists')
      }

      if (args.description.length > maxServiceDescriptionLength) {
        throw new UserInputError(
          `description length is ${
            args.description.lengt
          }, but should be less than ${maxServiceDescriptionLength}`,
        )
      }

      if (args.name.length > maxServiceNameLength) {
        throw new UserInputError(
          `name length is ${
            args.name.lengt
          }, but should be less than ${maxServiceNameLength}`,
        )
      }

      const { location } = (await getUser(args.userId)) as IUserDocument

      const { _id, userId, ...serviceDocumentRest } = await addService({
        ...args,
        location,
      })

      return {
        ...serviceDocumentRest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
    deleteService: async (_: unknown, args: any, context: IContext) => {
      const service = await getService(args.id)

      if (!service) throw new UserInputError('not found')

      const { _id, userId, ...rest } = service

      if (!(userId as any).equals(context.userId)) {
        throw new AuthenticationError('authed user does not match record user')
      }

      await deleteService(_id)

      return {
        ...rest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
    updateService: async (_: unknown, args: any, context: IContext) => {
      const service = await getService(args.id)

      if (!service) throw new UserInputError('not found')

      const { _id, userId, ...rest } = service

      if (!(userId as any).equals(context.userId)) {
        throw new AuthenticationError('authed user does not match record user')
      }

      const { id, ...restArgs } = args

      await updateService({
        _id: id,
        ...restArgs,
      })

      return {
        ...rest,
        id: _id.toString(),
        userId: userId.toString(),
      }
    },
  },
  Query: {
    services: async (_: unknown, args: any) => {
      const { limit, skip, ...filters } = args

      const [services, total] = await Promise.all([
        searchServices({ ...args, skip: args.skip || 0 }),
        countServices(filters),
      ])

      return {
        nodes: services.map(({ _id, userId, ...rest }) => ({
          ...rest,
          id: _id.toString(),
          userId: userId.toString(),
        })),
        total,
      }
    },
  },
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
