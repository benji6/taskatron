import { Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import log from '../../log'
import {
  countIroningServices,
  deleteIroningService,
  getIroningService,
  searchIroningServices,
  setIroningService,
  updateIroningService,
} from '../../model/ironingServices'
import { getUser } from '../../model/user'
import {
  IIroningFilters,
  IIroningPostBody,
  IIroningServiceSearchResponse,
  IroningDocument,
  IroningPostBody,
  IroningSearchParams,
  IServiceIroningDocument,
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
    const document = await getIroningService(id)

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

    await deleteIroningService(id)

    res.status(204).end()
  } catch (e) {
    res.status(500).end()
    logDelete(500, e)
  }
}

export const get = async (req: Request, res: Response) => {
  const {
    bedLinen,
    collectAndReturn,
    hasOwnEquipment,
    limit,
    other,
    shirts,
    skip,
    specialist,
    trousers,
  } = req.query

  const filters: IIroningFilters = removeUndefinedValues({
    bedLinen: parseBooleanQuery(bedLinen),
    collectAndReturn: parseBooleanQuery(collectAndReturn),
    hasOwnEquipment: parseBooleanQuery(hasOwnEquipment),
    other: parseBooleanQuery(other),
    shirts: parseBooleanQuery(shirts),
    specialist: parseBooleanQuery(specialist),
    trousers: parseBooleanQuery(trousers),
  })

  const searchParams = {
    ...filters,
    limit: Number(limit),
    skip: Number(skip),
  }

  if (!IroningSearchParams.is(searchParams)) {
    res.status(400).end()
    return logGet(
      400,
      PathReporter.report(IroningSearchParams.decode(searchParams)),
    )
  }

  try {
    const serviceDocuments = await searchIroningServices(searchParams)

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

    const total = await countIroningServices(filters)

    const responseBody: IIroningServiceSearchResponse = {
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
  const body: IIroningPostBody = req.body
  const userId = (req as IRequest).user

  if (!IroningPostBody.is(body)) {
    res.status(400).end()
    return logPost(400, PathReporter.report(IroningPostBody.decode(body)))
  }

  try {
    if (await getIroningService(userId)) {
      res.status(409).end()
      return logPost(409, `record for userId: ${userId} already exists`)
    }

    const serviceDocument = await setIroningService({
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
  const body: IServiceIroningDocument = req.body
  const userId = (req as IRequest).user

  if (!IroningDocument.is(body)) {
    res.status(400).end()
    return logPut(400, PathReporter.report(IroningDocument.decode(body)))
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
    const document = await getIroningService(id)

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

    await updateIroningService(body)

    res.status(200).send(body)
  } catch (e) {
    res.status(500).end()
    logPut(500, e)
  }
}
