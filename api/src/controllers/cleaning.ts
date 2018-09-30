import { Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import log from '../log'
import {
  countServices,
  deleteService,
  getService,
  searchServices,
  setService,
  updateService,
} from '../model/services'
import { getUser } from '../model/user'
import {
  IServiceDocument,
  IServiceFilters,
  IServicePostBody,
  IServiceSearchResponse,
  IUserResponse,
  ServiceDocument,
  ServicePostBody,
  ServiceSearchParams,
} from '../shared/types'
import { removeUndefinedValues } from '../shared/utils'
import { parseBooleanQuery } from './utils'

interface IRequest extends Request {
  user: string
}

const logCleaning = log('service')
const logGet = logCleaning('GET')
const logDelete = logCleaning('DELETE')
const logPost = logCleaning('POST')
const logPut = logCleaning('PUT')

export const del = async (req: Request, res: Response) => {
  const { user: userId } = req as IRequest
  const { id } = req.params

  try {
    const document = await getService(id)

    if (!document) {
      res.status(404).end()
      return logDelete(404, `id: ${id}`)
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return logDelete(
        403,
        `userId: ${userId} does not match document.userId: ${document.userId}`,
      )
    }

    await deleteService(id)

    res.status(204).end()
  } catch (e) {
    res.status(500).end()
    logDelete(500, e)
  }
}

export const get = async (req: Request, res: Response) => {
  const {
    carpetClean,
    deepClean,
    general,
    hasOwnEquipment,
    hasOwnProducts,
    limit,
    ovenClean,
    skip,
  } = req.query

  const filters: IServiceFilters = removeUndefinedValues({
    carpetClean: parseBooleanQuery(carpetClean),
    deepClean: parseBooleanQuery(deepClean),
    general: parseBooleanQuery(general),
    hasOwnEquipment: parseBooleanQuery(hasOwnEquipment),
    hasOwnProducts: parseBooleanQuery(hasOwnProducts),
    ovenClean: parseBooleanQuery(ovenClean),
  })

  const searchParams = {
    ...filters,
    limit: Number(limit),
    skip: Number(skip),
  }

  if (!ServiceSearchParams.is(searchParams)) {
    res.status(400).end()
    return logGet(
      400,
      PathReporter.report(ServiceSearchParams.decode(searchParams)),
    )
  }

  try {
    const serviceDocuments = await searchServices(searchParams)

    const results = await Promise.all(
      serviceDocuments.map(async serviceDocument => {
        const { firstName, lastName } = (await getUser(
          serviceDocument.userId,
        )) as IUserResponse

        return {
          ...serviceDocument,
          providerName: `${firstName} ${lastName}`,
        }
      }),
    )

    const total = await countServices(filters)

    const responseBody: IServiceSearchResponse = {
      results,
      total,
    }

    res.status(200).send(responseBody)
  } catch (e) {
    res.status(500).end()
    logGet(500, e)
  }
}

export const post = async (req: Request, res: Response) => {
  const body: IServicePostBody = req.body
  const userId = (req as IRequest).user

  if (!ServicePostBody.is(body)) {
    res.status(400).end()
    return logPost(400, PathReporter.report(ServicePostBody.decode(body)))
  }

  try {
    if (await getService(userId)) {
      res.status(409).end()
      return logPost(409, `record for userId: ${userId} already exists`)
    }

    const serviceDocument = await setService({
      ...body,
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    logPost(500, e)
    res.status(500).end()
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
  const body: IServiceDocument = req.body
  const userId = (req as IRequest).user

  if (!ServiceDocument.is(body)) {
    res.status(400).end()
    return logPut(400, PathReporter.report(ServiceDocument.decode(body)))
  }

  if (id !== body._id) {
    res.status(400).end()
    return logPut(
      400,
      `Resource id: ${id} does not match body._id: ${body._id}`,
    )
  }

  if (userId !== body.userId) {
    res.status(400).end()
    return logPut(
      400,
      `userId: ${userId} does not match body.userId: ${body.userId}`,
    )
  }

  try {
    const document = await getService(id)

    if (!document) {
      res.status(404).end()
      return logPut(404, `id: ${id}`)
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return logPut(
        403,
        `userId: ${userId} does not match document.userId: ${document.userId}`,
      )
    }

    await updateService(body)

    res.status(200).send(body)
  } catch (e) {
    res.status(500).end()
    logPut(500, e)
  }
}
