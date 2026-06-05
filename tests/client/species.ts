import { APIRequestContext } from "@playwright/test"

export async function listSpecies(
  request: APIRequestContext,
  token: string,
) {
  const response = await request.get('/api/species', {
    headers: { Authorization: 'Bearer ' + token },
  })

  return response

}


