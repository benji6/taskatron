import { Request, Response } from 'express'
import {
  countCleaningServices,
  deleteCleaningService,
  getCleaningService,
  searchCleaningServices,
  setCleaningService,
  updateCleaningService,
} from '../../model/cleaningServices'
import { getUser } from '../../model/user'
import pino from '../../pino'
import {
  ICleaningFilters,
  ICleaningServiceSearchResponse,
  IServiceCleaningDocument,
  IServiceCleaningPostBody,
  IUserDocument,
} from '../../shared/types'
import { removeUndefinedValues } from '../../shared/utils'
import { isBoolean, isDecimal, isValidNumber } from '../../shared/validation'
import { parseBooleanQuery } from '../utils'

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
  const {
    carpetClean,
    deepClean,
    general,
    hasOwnEquipment,
    hasOwnProducts,
    limit = '0',
    ovenClean,
    skip = '0',
  } = req.query

  if (!isValidNumber(limit) || !isValidNumber(skip)) {
    res.status(400).end()
  }

  const filters: ICleaningFilters = removeUndefinedValues({
    carpetClean: parseBooleanQuery(carpetClean),
    deepClean: parseBooleanQuery(deepClean),
    general: parseBooleanQuery(general),
    hasOwnEquipment: parseBooleanQuery(hasOwnEquipment),
    hasOwnProducts: parseBooleanQuery(hasOwnProducts),
    ovenClean: parseBooleanQuery(ovenClean),
  })

  try {
    const serviceDocuments = await searchCleaningServices({
      ...filters,
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

    const total = await countCleaningServices(filters)

    const responseBody: ICleaningServiceSearchResponse = {
      results,
      total,
    }

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
