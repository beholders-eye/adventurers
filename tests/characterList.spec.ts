import { test, expect } from '@playwright/test'

var token: string

auth()
validateCharList()

function auth() {
  test("Generate a token", async ({ request }) => {
    const user: string = process.env.API_USER
    const password: string = process.env.API_PWD

    expect(user).toBeDefined()
    expect(password).toBeDefined()

    const tokenResponse = await request.post(
      "https://adventurers-guild-api.vercel.app/api/auth/token",
      {
        data: { username: user, password: password }
      }
    )

    const tokenResponseBody = await tokenResponse.json()

    expect(tokenResponse.status()).toBe(200)

    expect(tokenResponseBody.token).not.toBeUndefined()
    expect(tokenResponseBody.token).not.toBe("")

    // Save the token
    token = "Bearer " + tokenResponseBody.token
  })
}

function validateCharList() {
  test("List characters", async ({ request }) => {
    const charResponse = await request.get(
      'https://adventurers-guild-api.vercel.app/api/characters',
      {
        headers: { Authorization: token },
      },
    )

    const charResponseBody = await charResponse.json()

    expect(charResponse.status()).toBe(200)

    expect(charResponseBody).toHaveProperty("length")
    expect(charResponseBody.length).toBeGreaterThan(2)

    expect(charResponseBody[0].id).toBe(1675)
  })
}
