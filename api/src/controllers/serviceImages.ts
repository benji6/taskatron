import * as crypto from 'crypto'
import { Request, Response } from 'express'
import { deleteImage, uploadImage } from '../model/serviceImages'
import { getService } from '../model/services'
import pino from '../pino'

interface IRequest extends Request {
  user: string
}

const computeImageName = (extension: string, file: Buffer) =>
  `${crypto
    .createHash('md5')
    .update(file)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}.${extension}`

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

  const { imagePath, userId } = service

  if (!(userId as any).equals(user)) {
    pino.error(
      `DELETE /services/${id}/image 403: service.userId=${userId}, userId=${user}`,
    )
    return res.status(403).end()
  }

  if (!imagePath) {
    pino.error(`DELETE /services/${id}/image 404 - imagePath is undefined`)
    return res.status(404).end()
  }

  await deleteImage(imagePath)
  res.status(204).end()
}

export const post = async (req: Request, res: Response) => {
  const {
    body,
    params: { extension, id },
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
    filename: computeImageName(extension, body),
    id,
    image: body,
  })

  res.status(200).send({ imagePath })
}

export const put = async (req: Request, res: Response) => {
  const {
    body,
    params: { extension, id },
    user,
  } = req as IRequest
  const service = await getService(id)

  if (!service) {
    pino.error(`POST /services/${id}/image 404`)
    return res.status(404).end()
  }

  const { imagePath: oldImagePath, userId } = service

  if (!(userId as any).equals(user)) {
    pino.error(
      `POST /services/${id}/image 403: service.userId=${userId}, userId=${user}`,
    )
    return res.status(403).end()
  }

  const imagePath = await uploadImage({
    filename: computeImageName(extension, body),
    id,
    image: body,
  })

  if (oldImagePath && imagePath !== oldImagePath) deleteImage(oldImagePath)

  res.status(200).send({ imagePath })
}
