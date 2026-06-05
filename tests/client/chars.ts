import { APIRequestContext } from "@playwright/test"
import { Character } from "../schemas/chars";

export async function createChar(
  request: APIRequestContext,
  token: string,
  data: Character,
) {
  const response = await request.post('/api/characters', {
    headers: { Authorization: 'Bearer ' + token },
    data,
  })

  return response

}
