import { Request, Response } from 'express'
import {
  countGardeningServices,
  deleteGardeningService,
  getGardeningService,
  searchGardeningServices,
  setGardeningService,
  updateGardeningService,
} from '../../model/gardeningServices'
import { getUser } from '../../model/user'
import pino from '../../pino'
import {
  IGardeningServiceSearchResponse,
  IServiceGardeningDocument,
  IServiceGardeningPostBody,
  IUserDocument,
} from '../../shared/types'
import { isBoolean, isDecimal } from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const del = async (req: Request, res: Response) => {
  const { user: userId } = req as IRequest
  const { id } = req.params

  try {
    const document = await getGardeningService(id)

    if (!document) {
      res.status(400).end()
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await deleteGardeningService(id)
    res.status(204).end()
  } catch (e) {
    pino.error('DELETE /services/gardening', e)
    res.status(500).end()
  }
}

export const get = async (req: Request, res: Response) => {
  const { limit = 0, skip = 0 } = req.query

  try {
    const serviceDocuments = await searchGardeningServices({
      limit: Number(limit),
      skip: Number(skip),
    })

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

    const total = await countGardeningServices()

    const responseBody: IGardeningServiceSearchResponse = {
      results,
      total,
    }

    res.status(200).send(responseBody)
  } catch (e) {
    pino.error('GET /services/gardening', e)
    res.status(500).end()
  }
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceGardeningPostBody = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.general) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.hasOwnProducts) ||
    !isBoolean(body.specialist) ||
    !isDecimal(body.hourlyRate)
  ) {
    res.status(400).end()
    return
  }

  try {
    if (await getGardeningService(userId)) {
      res.status(409).end()
      return
    }

    const serviceDocument = await setGardeningService({
      ...body,
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    pino.error('POST services/gardening', e)
    res.status(500).end()
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
  const body: IServiceGardeningDocument = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.general) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.hasOwnProducts) ||
    !isBoolean(body.specialist) ||
    !isDecimal(body.hourlyRate) ||
    id !== body._id ||
    body.userId !== userId
  ) {
    res.status(400).end()
    return
  }

  try {
    const document = await getGardeningService(id)

    if (!document) {
      res.status(404).end()
      pino.info('PUT services/gardening 404', id)
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await updateGardeningService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT services/gardening', e)
    res.status(500).end()
  }
}
