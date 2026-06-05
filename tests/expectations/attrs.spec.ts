import { expect, test } from "@playwright/test"
import { token } from "../client/authn"
import { getAttrs } from "../client/attrs";
import { ATTRIBUTE_TESTS } from "../data/attrs";

let currentToken: string = ""

test.beforeAll(async ({ request }) => {
  currentToken = await token(request)
})

for (let idx in ATTRIBUTE_TESTS) {
  const attribute = ATTRIBUTE_TESTS[idx]
  test(`Validate the ${attribute.name} attribute`, async ({ request }) => {
    const attrsResponse = await getAttrs(request, currentToken)
    const attrs = await attrsResponse.json()

    expect(attrs[attribute.index].id).toBe(attribute.id)
    expect(attrs[attribute.index].name).toBe(attribute.name)
    expect(attrs[attribute.index].shortname).toBe(attribute.shortname)
    expect(attrs[attribute.index].description).toContain(attribute.description)
    if (attrs[attribute.index].skills[0]) {
      expect(attrs[attribute.index].skills[0]).toBe(attribute.firstSkill)
    }
  })
}

