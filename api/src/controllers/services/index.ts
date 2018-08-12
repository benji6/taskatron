import { Request, Response } from 'express'
import { deleteService, getService, getServices } from '../../model/services'
import pino from '../../pino'

interface IRequest extends Request {
  user: string
}

interface IBody {
  _id: string
}

export const del = async (req: Request, res: Response) => {
  const body: IBody = req.body
  const userId = (req as IRequest).user

  try {
    const document = await getService(body._id)

    if (!document) {
      res.status(400).send('document does not exist')
      return
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).send('forbidden')
      return
    }

    await deleteService(body._id)
    res.status(204).end()
  } catch (e) {
    pino.error('DELETE /services error', e)
    res.status(500).end()
  }
}

export const get = async (req: Request, res: Response) => {
  try {
    const serviceDocument = await getServices((req as IRequest).user)
    res.status(200).send(serviceDocument)
  } catch (e) {
    pino.error('GET /services error', e)
    res.status(500).end()
  }
}
