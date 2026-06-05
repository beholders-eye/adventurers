import { expect, test } from "@playwright/test"
import { token } from "../client/authn"
import { createChar } from "../client/chars"

let currentToken = ""
let charId = ""

test.describe.serial("Sanchez the Barbarian Outcast", () => {
  test.beforeAll(async ({ request }) => {
    currentToken = (await token(request))
  })
})
