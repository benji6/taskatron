export interface IUserPostBody {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
}

export interface IUserRecord extends IUserPostBody {
  readonly _id: string
}
