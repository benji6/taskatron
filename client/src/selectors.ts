import IState from './types/IState';

export const isLoggedInSelector = (state: IState): boolean => state.auth.isLoggedIn
