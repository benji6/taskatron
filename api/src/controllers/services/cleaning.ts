import { Request, Response } from 'express'
import {
  deleteCleaningService,
  getCleaningService,
  searchCleaningServices,
  setCleaningService,
  updateCleaningService,
} from '../../model/cleaningServices'
import { getUser } from '../../model/user'
import pino from '../../pino'
import {
  IServiceCleaningDocument,
  IServiceCleaningPostBody,
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
    const document = await getCleaningService(id)

    if (!document) {
      res.status(400).end()
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await deleteCleaningService(id)
    res.status(204).end()
  } catch (e) {
    pino.error('DELETE /services/cleaning', e)
    res.status(500).end()
  }
}

export const get = async (req: Request, res: Response) => {
  try {
    const serviceDocuments = await searchCleaningServices()
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
    pino.error('GET /services/cleaning', e)
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
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    pino.error('POST services/cleaning', e)
    res.status(500).end()
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
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
    id !== body._id ||
    body.userId !== userId
  ) {
    res.status(400).end()
    return
  }

  try {
    const document = await getCleaningService(id)

    if (!document) {
      res.status(404).end()
      pino.info('PUT services/cleaning 404', id)
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return
    }

    await updateCleaningService(body)

    res.status(200).send(body)
  } catch (e) {
    pino.error('PUT services/cleaning', e)
    res.status(500).end()
  }
}
