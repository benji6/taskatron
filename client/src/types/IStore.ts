import * as auth from '../reducers/auth'
import * as user from '../reducers/user'

export default interface IStore {
  readonly auth: auth.IState
  readonly user: user.IState
}
