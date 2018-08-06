import { Request, Response } from 'express'
import { CLEANING } from '../../constants/services'
import { setCleaningService } from '../../model'
import pino from '../../pino'
import { IServiceCleaningPostBody } from '../../shared/types'
import { isBoolean, isDecimal } from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceCleaningPostBody = req.body

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
    const serviceRecord = await setCleaningService({
      ...body,
      service: CLEANING,
      userId: (req as IRequest).user,
    })
    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('service/cleaning post fail', e)
    res.status(500).end()
  }
}
