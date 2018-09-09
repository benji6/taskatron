import { Request, Response } from 'express'
import { getServices } from '../model/services'
import { getUser } from '../model/user'
import pino from '../pino'
import { IServiceResponseObject, IUserDocument } from '../shared/types'

export const get = async (req: Request, res: Response) => {
  try {
    const serviceDocuments = await getServices()
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
