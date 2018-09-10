import { Request, Response } from 'express'
import {
  getGardeningService,
  setGardeningService,
  setService,
} from '../../model/services'
import pino from '../../pino'
import { GARDENING } from '../../shared/services'
import {
  IServiceGardeningDocument,
  IServiceGardeningPostBody,
} from '../../shared/types'
import {
  isBoolean,
  isDecimal,
  isService,
  isString,
} from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const put = async (req: Request, res: Response) => {
  const body: IServiceGardeningDocument = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.general) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.hasOwnProducts) ||
    !isBoolean(body.specialist) ||
    !isDecimal(body.hourlyRate) ||
    !isService(body.service) ||
    !isString(body._id) ||
    body.userId !== userId
  ) {
    res.status(400).send('invalid request body')
    return
  }

  const document = await getGardeningService(body._id)

  try {
    if (!document) {
      res.status(404).end()
      return
    }

    await setService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT me/services/gardening', e)
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
    res.status(400).send('invalid request body')
    return
  }

  try {
    if (await getGardeningService(userId)) {
      res.status(400).send('document already exists')
      return
    }

    const serviceDocument = await setGardeningService({
      ...body,
      service: GARDENING,
      userId,
    })

    res.status(200).send(serviceDocument)
  } catch (e) {
    pino.error('POST me/services/gardening', e)
    res.status(500).end()
  }
}
