const toBlob = (
  canvas: HTMLCanvasElement,
  callback: BlobCallback,
  type: string,
  quality: number,
) => {
  if (canvas.toBlob) return canvas.toBlob(callback, type, quality)

  const binaryString = atob(canvas.toDataURL(type, quality).split(',')[1])
  const { length } = binaryString
  const arr = new Uint8Array(length)

  for (let i = 0; i < length; i++) arr[i] = binaryString.charCodeAt(i)

  callback(new Blob([arr], { type: type || 'image/png' }))
}

// -2 = not jpeg, -1 = no data, 1..8 = orientations
// https://stackoverflow.com/a/32490603
const getExifOrientation = (file: File): Promise<number> =>
  new Promise(resolve => {
    // https://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2
    const blob: Blob = file.slice ? file.slice(0, 128000) : file
    const reader = new FileReader()

    reader.onload = () => {
      const view = new DataView(reader.result as ArrayBuffer)
      if (view.getUint16(0, false) !== 0xffd8) return resolve(-2)
      let offset = 2
      while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return resolve(-1)
          }
          const little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          const tags = view.getUint16(offset, little)
          offset += 2
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              return resolve(view.getUint16(offset + i * 12 + 8, little))
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) break
        else offset += view.getUint16(offset, false)
      }
      resolve(-1)
    }

    reader.readAsArrayBuffer(blob)
  })

const renderToCanvas = ({
  height,
  image,
  orientation,
  width,
}: {
  height: number
  image: HTMLImageElement
  orientation: number
  width: number
}): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')

  canvas.width = orientation > 4 ? height : width
  canvas.height = orientation > 4 ? width : height

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  if (orientation === 2) ctx.transform(-1, 0, 0, 1, width, 0)
  else if (orientation === 3) ctx.transform(-1, 0, 0, -1, width, height)
  else if (orientation === 4) ctx.transform(1, 0, 0, -1, 0, height)
  else if (orientation === 5) ctx.transform(0, 1, 1, 0, 0, 0)
  else if (orientation === 6) ctx.transform(0, 1, -1, 0, height, 0)
  else if (orientation === 7) ctx.transform(0, -1, -1, 0, height, width)
  else if (orientation === 8) ctx.transform(0, -1, 1, 0, 0, width)

  ctx.drawImage(image, 0, 0, width, height)

  return canvas
}

export default ({
  file: originalFile,
  maxHeight,
  maxWidth,
  quality,
  sizeThreshold,
}: {
  file: File
  maxHeight: number
  maxWidth: number
  quality: number
  sizeThreshold: number
}): Promise<File> =>
  new Promise(resolve => {
    if (originalFile.size <= sizeThreshold) return resolve(originalFile)

    const image = new Image()

    image.onerror = () => {
      URL.revokeObjectURL(image.src)
      resolve(originalFile)
    }

    image.onload = async () => {
      URL.revokeObjectURL(image.src)
      let orientation = -1
      try {
        orientation = await getExifOrientation(originalFile)
      } catch {
        // empty
      }
      const { height, width } = image
      const scale =
        orientation > 4
          ? Math.min(maxHeight / width, maxWidth / height, 1)
          : Math.min(maxWidth / width, maxHeight / height, 1)

      const canvas = renderToCanvas({
        height: Math.round(height * scale),
        image,
        orientation,
        width: Math.round(width * scale),
      })

      toBlob(
        canvas,
        (blob: Blob | null) => {
          if (!blob) return resolve(originalFile)
          const newFile = new File([blob], originalFile.name, {
            lastModified: originalFile.lastModified,
            type: originalFile.type,
          })
          resolve(newFile)
        },
        'image/jpeg',
        quality,
      )
    }

    image.src = URL.createObjectURL(originalFile)
  })
