import * as AWS from 'aws-sdk'

interface IUploadData {
  ETag: string
  Location: string
  Key: string
  Bucket: string
}

const Bucket = 'taskatron-service-images'
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-west-2' })

export const deleteImage = (id: string): Promise<void> =>
  new Promise((resolve, reject) =>
    s3.deleteObject(
      {
        Bucket,
        Key: `${id}/image.jpg`,
      },
      (err: Error) => {
        if (err) return reject(err)
        resolve()
      },
    ),
  )

export const uploadImage = ({
  id,
  image,
}: {
  id: string
  image: any
}): Promise<string> =>
  new Promise((resolve, reject) =>
    s3.upload(
      {
        Body: image,
        Bucket,
        Key: `${id}/image.jpg`,
      },
      (err: Error, data: IUploadData) => {
        if (err) return reject(err)
        resolve(data.Location)
      },
    ),
  )
