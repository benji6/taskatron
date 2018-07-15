import * as user from '../reducers/user'

export default interface IStore {
  readonly user: user.IState
}
