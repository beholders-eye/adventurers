import { APIRequestContext } from "@playwright/test";
import { BASE_FQDN, HTTP_P_SCHEMA, TOKEN_ENDPOINT } from "../data/shared";

export async function token(request: APIRequestContext) {
  const user: string = process.env.API_USER
  const password: string = process.env.API_PWD

  return request.post(
    HTTP_P_SCHEMA + "://" + BASE_FQDN + TOKEN_ENDPOINT,
    {
      data: { username: user, password: password }
    }
  )
}
