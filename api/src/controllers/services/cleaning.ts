import { Request, Response } from 'express'
import {
  getCleaningService,
  getService,
  setCleaningService,
  setService,
} from '../../model/services'
import pino from '../../pino'
import { CLEANING } from '../../shared/services'
import {
  IServiceCleaningPostBody,
  IServiceCleaningRecord,
} from '../../shared/types'
import { isBoolean, isDecimal, isString } from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const put = async (req: Request, res: Response) => {
  const body: IServiceCleaningRecord = req.body
  const userId = (req as IRequest).user

  if (
    !isString((body as any)._id) ||
    body.userId !== userId ||
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

  const record = await getService((body as any)._id)

  try {
    if (!record) {
      res.status(400).send('record does not exist')
      return
    }

    const serviceRecord = await setService(body)

    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('services/cleaning put fail', e)
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
      res.status(400).send('record already exists')
      return
    }

    const serviceRecord = await setCleaningService({
      ...body,
      service: CLEANING,
      userId,
    })

    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('services/cleaning post fail', e)
    res.status(500).end()
  }
}
