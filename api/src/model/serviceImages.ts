import * as AWS from 'aws-sdk'

interface IUploadData {
  ETag: string
  Location: string
  Key: string
  Bucket: string
}

const Bucket = 'taskatron-service-images'
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-west-2' })

export const deleteImage = (Key: string): Promise<void> =>
  new Promise((resolve, reject) =>
    s3.deleteObject(
      {
        Bucket,
        Key,
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
  filename,
}: {
  id: string
  image: Buffer
  filename: string
}): Promise<string> =>
  new Promise((resolve, reject) => {
    const Key = `${id}/${filename}`

    s3.upload(
      {
        Body: image,
        Bucket,
        Key,
      },
      (err: Error, _: IUploadData) => {
        if (err) return reject(err)
        resolve(Key)
      },
    )
  })
