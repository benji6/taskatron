interface IObject<A> {
  [k: string]: A
}

export const filterObj = <A>(f: (a: A) => boolean, o: IObject<A>) => {
  const p: IObject<A> = {}

  for (const [k, v] of Object.entries(o)) if (f(v)) p[k] = v

  return p
}
