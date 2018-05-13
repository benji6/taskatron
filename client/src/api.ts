export const authSignIn = (email: string): Promise<Response> => fetch('http://localhost:3001/sign-in')
