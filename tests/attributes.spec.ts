import { test, expect } from '@playwright/test'

type TestParameters = {
  index: number
  id: number
  name: string
  shortname: string
  description: string
  firstSkill: string
}

validateAttribute(
  {
    index: 0, id: 1, name: 'Strength', shortname: 'STR',
    description: 'physical power', firstSkill: 'Athletics'
  })

validateAttribute(
  {
    index: 1, id: 2, name: 'Dexterity', shortname: 'DEX',
    description: 'affects actions that require speed, precision, and stealth', firstSkill: 'Acrobatics'
  }
)

validateAttribute(
  {
    index: 2, id: 3, name: 'Constitution', shortname: 'CON',
    description: 'commonly associated with health, stamina, and resistance', firstSkill: ''
  }
)

validateAttribute(
  {
    index: 3, id: 4, name: 'Intelligence', shortname: 'INT',
    description: 'linked to learning, investigation, and logical', firstSkill: 'Arcana'
  }
)

validateAttribute(
  {
    index: 4, id: 5, name: 'Wisdom', shortname: 'WIS',
    description: 'good judgment. It reflects how well a character understands the', firstSkill: 'Animal Handling'
  }
)

function validateAttribute(params: TestParameters) {
  test("Validate the " + params.shortname + " attribute", async ({ request }) => {
    const response = await request.get(
      'https://adventurers-guild-api.vercel.app/api/attributes'
    )

    const responseBody = await response.json()

    expect(response.status()).toBe(200)

    expect(responseBody[params.index].id).toBe(params.id)
    expect(responseBody[params.index].name).toBe(params.name)
    expect(responseBody[params.index].shortname).toBe(params.shortname)
    expect(responseBody[params.index].description).toContain(params.description)
    if (responseBody[params.index].skills[0]) {
      expect(responseBody[params.index].skills[0]).toBe(params.firstSkill)
    }
  })
}
