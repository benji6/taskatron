import { Request, Response } from 'express'
import {
  getCleaningService,
  setCleaningService,
  setService,
} from '../../model/services'
import pino from '../../pino'
import { CLEANING } from '../../shared/services'
import {
  IServiceCleaningDocument,
  IServiceCleaningPostBody,
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
  const body: IServiceCleaningDocument = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.carpetClean) ||
    !isBoolean(body.deepClean) ||
    !isBoolean(body.general) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.hasOwnProducts) ||
    !isBoolean(body.ovenClean) ||
    !isDecimal(body.hourlyRate) ||
    !isService(body.service) ||
    !isString(body._id) ||
    body.userId !== userId
  ) {
    res.status(400).send('invalid request body')
    return
  }

  const document = await getCleaningService(body._id)

  try {
    if (!document) {
      res.status(404).end()
      return
    }

    await setService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT me/services/cleaning', e)
    res.status(500).end()
  }
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceCleaningPostBody = req.body
  const userId = (req as IRequest).user

  if (
    !isBoolean(body.carpetClean) ||
    !isBoolean(body.deepClean) ||
    !isBoolean(body.general) ||
    !isBoolean(body.hasOwnEquipment) ||
    !isBoolean(body.hasOwnProducts) ||
    !isBoolean(body.ovenClean) ||
    !isDecimal(body.hourlyRate)
  ) {
    res.status(400).send('invalid request body')
    return
  }

  try {
    if (await getCleaningService(userId)) {
      res.status(400).send('document already exists')
      return
    }

    const serviceDocument = await setCleaningService({
      ...body,
      service: CLEANING,
      userId,
    })

    res.status(200).send(serviceDocument)
  } catch (e) {
    pino.error('POST me/services/cleaning', e)
    res.status(500).end()
  }
}
