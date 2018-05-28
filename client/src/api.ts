const origin = 'http://localhost:3001'

export const sendToken = (email: string): Promise<Response> => fetch(`${origin}/send-token`, {
  body: JSON.stringify({user: email}),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'post',
})
