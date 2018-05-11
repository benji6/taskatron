import * as auth from '../reducers/auth'

export default interface IStore {
  readonly auth: auth.IState,
}
