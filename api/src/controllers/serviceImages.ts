import * as crypto from 'crypto'
import { Request, Response } from 'express'
import { deleteImage, uploadImage } from '../model/serviceImages'
import { getService } from '../model/services'
import pino from '../pino'

interface IRequest extends Request {
  user: string
}

const computeImageName = (file: Buffer) =>
  crypto
    .createHash('md5')
    .update(file)
    .digest('base64')

export const del = async (req: Request, res: Response) => {
  const {
    params: { id },
    user,
  } = req as IRequest
  const service = await getService(id)

  if (!service) {
    pino.error(`DELETE /services/${id}/image 404`)
    return res.status(404).end()
  }

  const { userId } = service

  if (!(userId as any).equals(user)) {
    pino.error(
      `DELETE /services/${id}/image 403: service.userId=${userId}, userId=${user}`,
    )
    return res.status(403).end()
  }

  await deleteImage(id)
  res.status(204).end()
}

export const post = async (req: Request, res: Response) => {
  const {
    body,
    params: { id },
    user,
  } = req as IRequest
  const service = await getService(id)

  if (!service) {
    pino.error(`POST /services/${id}/image 404`)
    return res.status(404).end()
  }

  const { userId } = service

  if (!(userId as any).equals(user)) {
    pino.error(
      `POST /services/${id}/image 403: service.userId=${userId}, userId=${user}`,
    )
    return res.status(403).end()
  }

  const imagePath = await uploadImage({
    id,
    image: body,
    name: computeImageName(body),
  })

  res.status(200).send({ imagePath })
}

export const put = async (req: Request, res: Response) => {
  const {
    body,
    params: { id },
    user,
  } = req as IRequest
  const service = await getService(id)

  if (!service) {
    pino.error(`POST /services/${id}/image 404`)
    return res.status(404).end()
  }

  const { userId } = service

  if (!(userId as any).equals(user)) {
    pino.error(
      `POST /services/${id}/image 403: service.userId=${userId}, userId=${user}`,
    )
    return res.status(403).end()
  }

  // TODO: get the old file name and if it's different from the new one then delete it (different extension for example)
  const imagePath = await uploadImage({
    id,
    image: body,
    name: computeImageName(body),
  })
  res.status(200).send({ imagePath })
}
