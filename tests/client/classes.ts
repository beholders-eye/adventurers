import { APIRequestContext } from "@playwright/test"

export async function listClasses(
  request: APIRequestContext,
  token: string,
) {
  const response = await request.get('/api/classes', {
    headers: { Authorization: 'Bearer ' + token },
  })

  return response

}

