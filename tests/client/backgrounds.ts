import { APIRequestContext } from "@playwright/test"

export async function listBackgrounds(
  request: APIRequestContext,
  token: string,
) {
  const response = await request.get('/api/backgrounds', {
    headers: { Authorization: 'Bearer ' + token },
  })

  return response

}



