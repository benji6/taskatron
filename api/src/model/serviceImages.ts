import * as AWS from 'aws-sdk'

interface IUploadData {
  ETag: string
  Location: string
  Key: string
  Bucket: string
}

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-west-2' })

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
        Bucket: 'taskatron-service-images',
        Key: `${id}.jpg`,
      },
      (err: Error, data: IUploadData) => {
        if (err) return reject(err)
        resolve(data.Location)
      },
    ),
  )
