import { APIResponse, expect, test } from "@playwright/test"

export async function tokenIsValid(currentToken: string) {
  await test.step("Is it null, is it a string, is it longer than 15", async () => {
    expect(currentToken).not.toBeNull()
    expect(typeof currentToken).toBe("string")
    expect(currentToken.length).toBeGreaterThan(15)
  })
}
