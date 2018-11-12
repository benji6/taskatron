import { Request, Response } from 'express'
import { PathReporter } from 'io-ts/lib/PathReporter'
import log from '../log'
import { getService, setService, updateService } from '../model/services'
import { getUser } from '../model/user'
import {
  IServiceDocument,
  IServicePostBody,
  IUserDocument,
  ServiceDocument,
  ServicePostBody,
} from '../shared/types'

interface IRequest extends Request {
  user: string
}

const logCleaning = log('service')
const logPost = logCleaning('POST')
const logPut = logCleaning('PUT')

export const post = async (req: Request, res: Response) => {
  const body: IServicePostBody = req.body
  const userId = (req as IRequest).user

  if (!ServicePostBody.is(body)) {
    res.status(400).end()
    return logPost(400, PathReporter.report(ServicePostBody.decode(body)))
  }

  try {
    if (await getService(userId)) {
      res.status(409).end()
      return logPost(409, `record for userId: ${userId} already exists`)
    }

    const { location } = (await getUser(userId)) as IUserDocument

    const serviceDocument = await setService({
      ...body,
      location,
      userId,
    })

    res.status(201).send(serviceDocument)
  } catch (e) {
    logPost(500, e)
    res.status(500).end()
  }
}

export const put = async (req: Request, res: Response) => {
  const { id } = req.params
  const body: IServiceDocument = req.body
  const userId = (req as IRequest).user

  if (!ServiceDocument.is(body)) {
    res.status(400).end()
    return logPut(400, PathReporter.report(ServiceDocument.decode(body)))
  }

  if (id !== body._id) {
    res.status(400).end()
    return logPut(
      400,
      `Resource id: ${id} does not match body._id: ${body._id}`,
    )
  }

  if (userId !== body.userId) {
    res.status(400).end()
    return logPut(
      400,
      `userId: ${userId} does not match body.userId: ${body.userId}`,
    )
  }

  try {
    const document = await getService(id)

    if (!document) {
      res.status(404).end()
      return logPut(404, `id: ${id}`)
    }

    if (!(document.userId as any).equals(userId)) {
      res.status(403).end()
      return logPut(
        403,
        `userId: ${userId} does not match document.userId: ${document.userId}`,
      )
    }

    await updateService(body)

    res.status(200).send(body)
  } catch (e) {
    res.status(500).end()
    logPut(500, e)
  }
}
