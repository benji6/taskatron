import { Request, Response } from 'express'
import { GARDENING } from '../../constants/services'
import { setGardeningService } from '../../model'
import pino from '../../pino'
import { IServiceGardeningPostBody } from '../../shared/types'
import { isBoolean, isDecimal } from '../../shared/validation'

interface IRequest extends Request {
  user: string
}

export const post = async (req: Request, res: Response) => {
  const body: IServiceGardeningPostBody = req.body
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
    const serviceRecord = await setGardeningService({
      ...body,
      service: GARDENING,
      userId: (req as IRequest).user,
    })
    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('services/gardening post fail', e)
    res.status(500).end()
  }
}
