import { AuthenticationError, UserInputError } from 'apollo-server-express'
import {
  maxServiceDescriptionLength,
  maxServiceNameLength,
} from 'shared/constants'
import { IUserDocument } from 'shared/types'
import { deleteImage } from '../model/serviceImages'
import {
  addService,
  countServices,
  deleteService,
  getService,
  getServiceByUserId,
  searchServices,
  updateService,
} from '../model/services'
import { getUser } from '../model/users'
import pino from '../pino'
import { IService } from '../types'

interface IContext {
  userId: string
}

interface IServices {
  nodes: IService[]
  total: number
}

export default {
  Mutation: {
    addService: async (
      _: unknown,
      args: any,
      context: IContext,
    ): Promise<IService> => {
      if (args.userId !== context.userId) {
        throw new AuthenticationError('Authed user does not match record user')
      }
      if (await getServiceByUserId(args.userId)) {
        throw new UserInputError('record already exists')
      }
      if (args.description.length > maxServiceDescriptionLength) {
        throw new UserInputError(
          `description length is ${
            args.description.length
          }, but should be less than ${maxServiceDescriptionLength}`,
        )
      }
      if (args.name.length > maxServiceNameLength) {
        throw new UserInputError(
          `name length is ${
            args.name.length
          }, but should be less than ${maxServiceNameLength}`,
        )
      }
      const { location } = (await getUser(args.userId)) as IUserDocument
      return addService({
        ...args,
        location,
      })
    },
    deleteService: async (
      _: unknown,
      args: any,
      context: IContext,
    ): Promise<IService> => {
      const service = await getService(args.id)
      if (!service) throw new UserInputError('Not found')
      const { id: serviceId } = service
      if (service.userId !== context.userId) {
        throw new AuthenticationError('Authed user does not match record user')
      }
      await deleteService(serviceId)
      deleteImage(serviceId).catch(e =>
        pino.error(`deleteImage(${serviceId}) error:`, e),
      )
      return service
    },
    updateService: async (
      _: unknown,
      args: any,
      context: IContext,
    ): Promise<IService> => {
      const service = await getService(args.id)
      if (!service) throw new UserInputError('Not found')
      if (service.userId !== context.userId) {
        throw new AuthenticationError('Authed user does not match record user')
      }
      await updateService(args)
      return { ...service, ...args }
    },
  },
  Node: { __resolveType: () => null },
  Query: {
    service: async (_: unknown, { id }: any): Promise<IService> => {
      const service = await getService(id)
      if (!service) throw new UserInputError('Not found')
      return service
    },
    services: async (_: unknown, args: any): Promise<IServices> => {
      const { limit, skip, ...filters } = args
      const [nodes, total] = await Promise.all([
        searchServices({ ...args, skip: args.skip || 0 }),
        countServices(filters),
      ])
      return { nodes, total }
    },
  },
}
