import { test, expect } from '@playwright/test'

test('Validate attributes', async ({ request }) => {
  const response = await request.get(
    'https://adventurers-guild-api.vercel.app/api/attributes',
  )

  const responseBody = await response.json()

  expect(response.status()).toBe(200)

  expect(responseBody[0].id).toBe(1)
  expect(responseBody[0].name).toBe('Strength')
  expect(responseBody[0].shortname).toBe('STR')
  expect(responseBody[0].description).toContain('physical power')
  expect(responseBody[0].skills[0]).toBe('Athletics')
})
