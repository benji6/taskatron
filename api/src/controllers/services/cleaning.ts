import { Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import {
  countCleaningServices,
  deleteCleaningService,
  getCleaningService,
  searchCleaningServices,
  setCleaningService,
  updateCleaningService,
} from '../../model/cleaningServices'
import { getUser } from '../../model/user'
import pino from '../../pino'
import {
  CleaningDocument,
  CleaningPostBody,
  CleaningSearchParams,
  ICleaningFilters,
  ICleaningPostBody,
  ICleaningServiceSearchResponse,
  IServiceCleaningDocument,
  IUserDocument,
} from '../../shared/types'
import { removeUndefinedValues } from '../../shared/utils'
import { isDecimal } from '../../shared/validation'
import { parseBooleanQuery } from '../utils'

interface IRequest extends Request {
  user: string
}

const log = (resource: string) => (
  method: 'GET' | 'DELETE' | 'PATCH' | 'POST' | 'PUT',
) => (...args: Array<unknown>): void => {
  const [status, msg] = args as [string, unknown]
  if (args.length === 1) pino.error(`${method} ${resource} ${status}`)
  else pino.error(`${method} ${resource} ${status}`, msg)
}

const logCleaning = log('services/cleaning')
const logGet = logCleaning('GET')
const logDelete = logCleaning('DELETE')
const logPost = logCleaning('POST')
const logPut = logCleaning('PUT')

export const del = async (req: Request, res: Response) => {
  const { user: userId } = req as IRequest
  const { id } = req.params

  try {
    const document = await getCleaningService(id)

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

    await deleteCleaningService(id)

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

  const filters: ICleaningFilters = removeUndefinedValues({
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

  if (!CleaningSearchParams.is(searchParams)) {
    res.status(400).end()
    return logGet(
      400,
      PathReporter.report(CleaningSearchParams.decode(searchParams)),
    )
  }

  try {
    const serviceDocuments = await searchCleaningServices(searchParams)

    const results = await Promise.all(
      serviceDocuments.map(async serviceDocument => {
        const { firstName, lastName } = (await getUser(
          serviceDocument.userId,
        )) as IUserDocument

        return {
          ...serviceDocument,
          providerName: `${firstName} ${lastName}`,
        }
      }),
    )

    const total = await countCleaningServices(filters)

    const responseBody: ICleaningServiceSearchResponse = {
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
  const body: ICleaningPostBody = req.body
  const userId = (req as IRequest).user

  if (!CleaningPostBody.is(body)) {
    res.status(400).end()
    return logPost(400, PathReporter.report(CleaningPostBody.decode(body)))
  }

  if (!isDecimal(body.hourlyRate)) {
    res.status(400).end()
    return logPost(400, `hourlyRate is not decimal: ${body.hourlyRate}`)
  }

  try {
    if (await getCleaningService(userId)) {
      res.status(409).end()
      return logPost(409, `record for userId: ${userId} already exists`)
    }

    const serviceDocument = await setCleaningService({
      ...body,
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    pino.error('POST services/cleaning 500', e)
    logPost(500, e)
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
  const body: IServiceCleaningDocument = req.body
  const userId = (req as IRequest).user

  if (!CleaningDocument.is(body)) {
    res.status(400).end()
    return logPut(400, PathReporter.report(CleaningDocument.decode(body)))
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
    const document = await getCleaningService(id)

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

    await updateCleaningService(body)

    res.status(200).send(body)
  } catch (e) {
    res.status(500).end()
    logPut(500, e)
  }
}
