import { APIResponse, expect, test } from "@playwright/test"

export async function tokenIsValid(currentToken: string) {
  await test.step("Is it null, is it longer than 15", async () => {
    expect(currentToken).not.toBeNull()
    expect(currentToken.length).toBeGreaterThan(15)
  })
}

export async function statusOK(response: APIResponse) {
  await test.step("HTTP Status OK? 200", async () => {
    expect(response.status()).toBe(200)
  })
}

export async function statusCreated(response: APIResponse) {
  await test.step("HTTP Status Created? 201", async () => {
    expect(response.status()).toBe(201)
  })
}
