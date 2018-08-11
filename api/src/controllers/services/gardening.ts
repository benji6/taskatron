import { Request, Response } from 'express'
import { GARDENING } from '../../constants/services'
import { getGardeningService, setGardeningService } from '../../model/services'
import pino from '../../pino'
import { IServiceGardeningPostBody } from '../../shared/types'
import { isBoolean, isDecimal } from '../../shared/validation'

interface IRequest extends Request {
  user: string
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
      res.status(400).send('record already exists')
      return
    }

    const serviceRecord = await setGardeningService({
      ...body,
      service: GARDENING,
      userId,
    })

    res.status(200).send(serviceRecord)
  } catch (e) {
    pino.error('services/gardening post fail', e)
    res.status(500).end()
  }
}
