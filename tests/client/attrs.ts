import { APIRequestContext } from "@playwright/test";


export async function getAttrs(
  request: APIRequestContext,
  token: string
) {
  const response = await request.get('/api/attributes', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response
}
