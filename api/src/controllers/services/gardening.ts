import { Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import log from '../../log'
import {
  countGardeningServices,
  deleteGardeningService,
  getGardeningService,
  searchGardeningServices,
  setGardeningService,
  updateGardeningService,
} from '../../model/gardeningServices'
import { getUser } from '../../model/user'
import {
  GardeningDocument,
  GardeningPostBody,
  GardeningSearchParams,
  IGardeningFilters,
  IGardeningPostBody,
  IGardeningServiceSearchResponse,
  IServiceGardeningDocument,
  IUserDocument,
} from '../../shared/types'
import { removeUndefinedValues } from '../../shared/utils'
import { parseBooleanQuery } from '../utils'

interface IRequest extends Request {
  user: string
}

const logGardening = log('services/gardening')
const logGet = logGardening('GET')
const logDelete = logGardening('DELETE')
const logPost = logGardening('POST')
const logPut = logGardening('PUT')

export const del = async (req: Request, res: Response) => {
  const { user: userId } = req as IRequest
  const { id } = req.params

  try {
    const document = await getGardeningService(id)

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

    await deleteGardeningService(id)

    res.status(204).end()
  } catch (e) {
    res.status(500).end()
    logDelete(500, e)
  }
}

export const get = async (req: Request, res: Response) => {
  const {
    general,
    hasOwnEquipment,
    hasOwnProducts,
    limit,
    skip,
    specialist,
  } = req.query

  const filters: IGardeningFilters = removeUndefinedValues({
    general: parseBooleanQuery(general),
    hasOwnEquipment: parseBooleanQuery(hasOwnEquipment),
    hasOwnProducts: parseBooleanQuery(hasOwnProducts),
    specialist: parseBooleanQuery(specialist),
  })

  const searchParams = {
    ...filters,
    limit: Number(limit),
    skip: Number(skip),
  }

  if (!GardeningSearchParams.is(searchParams)) {
    res.status(400).end()
    return logGet(
      400,
      PathReporter.report(GardeningSearchParams.decode(searchParams)),
    )
  }

  try {
    const serviceDocuments = await searchGardeningServices(searchParams)

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

    const total = await countGardeningServices(filters)

    const responseBody: IGardeningServiceSearchResponse = {
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
  const body: IGardeningPostBody = req.body
  const userId = (req as IRequest).user

  if (!GardeningPostBody.is(body)) {
    res.status(400).end()
    return logPost(400, PathReporter.report(GardeningPostBody.decode(body)))
  }

  try {
    if (await getGardeningService(userId)) {
      res.status(409).end()
      return logPost(409, `record for userId: ${userId} already exists`)
    }

    const serviceDocument = await setGardeningService({
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
  const body: IServiceGardeningDocument = req.body
  const userId = (req as IRequest).user

  if (!GardeningDocument.is(body)) {
    res.status(400).end()
    return logPut(400, PathReporter.report(GardeningDocument.decode(body)))
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
    const document = await getGardeningService(id)

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

    await updateGardeningService(body)

    res.status(200).send(body)
  } catch (e) {
    res.status(500).end()
    logPut(500, e)
  }
}
