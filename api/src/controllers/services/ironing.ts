import { Request, Response } from 'express'
import {
  deleteIroningService,
  getIroningService,
  searchIroningServices,
  setIroningService,
  updateIroningService,
} from '../../model/ironingServices'
import { getUser } from '../../model/user'
import pino from '../../pino'
import {
  IServiceIroningDocument,
  IServiceIroningPostBody,
  IServiceResponseObject,
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
    const document = await getIroningService(id)

    if (!document) {
      res.status(400).end()
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await deleteIroningService(id)
    res.status(204).end()
  } catch (e) {
    pino.error('DELETE /services/ironing', e)
    res.status(500).end()
  }
}

export const get = async (req: Request, res: Response) => {
  try {
    const serviceDocuments = await searchIroningServices()
    const responseBody: IServiceResponseObject[] = await Promise.all(
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
    res.status(200).send(responseBody)
  } catch (e) {
    pino.error('GET /services', e)
    res.status(500).end()
  }
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceIroningPostBody = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.bedLinen) ||
    !isBoolean(body.collectAndReturn) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.other) ||
    !isBoolean(body.shirts) ||
    !isBoolean(body.specialist) ||
    !isBoolean(body.trousers) ||
    !isDecimal(body.hourlyRate)
  ) {
    res.status(400).end()
    return
  }

  try {
    if (await getIroningService(userId)) {
      res.status(400).end()
      return
    }

    const serviceDocument = await setIroningService({
      ...body,
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    pino.error('POST services/ironing', e)
    res.status(500).end()
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
  const body: IServiceIroningDocument = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.bedLinen) ||
    !isBoolean(body.collectAndReturn) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.other) ||
    !isBoolean(body.shirts) ||
    !isBoolean(body.specialist) ||
    !isBoolean(body.trousers) ||
    !isDecimal(body.hourlyRate) ||
    id !== body._id ||
    body.userId !== userId
  ) {
    res.status(400).end()
    return
  }

  try {
    const document = await getIroningService(id)

    if (!document) {
      res.status(404).end()
      pino.info('PUT services/ironing 404', id)
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await updateIroningService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT services/gardening', e)
    res.status(500).end()
  }
}
