export interface IState {
  readonly isLoggedIn: boolean
}

const initialState: IState = {
  isLoggedIn: false,
}

export default (state: IState = initialState): IState => state
