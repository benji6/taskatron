interface ISearchStringObject {
  [key: string]: unknown
}

export default (o: ISearchStringObject) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(o)) {
    if (value !== undefined) params.set(key, String(value))
  }

  return `?${params}`
}
