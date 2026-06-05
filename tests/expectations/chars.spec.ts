import { expect, request, test } from "@playwright/test"
import { token } from "../client/authn"
import { createChar } from "../client/chars"
import { listClasses } from "../client/classes"
import { statusOK } from "../lib/common"
import { Character } from "../schemas/chars"
import { listSpecies } from "../client/species"
import { listBackgrounds } from "../client/backgrounds"

let currentToken = ""
let charId: number = 0
let barbarianClassId: number = 0
let humanSpeciesId: number = 0
let hermitBackgroundId: number = 0

test.describe.serial("Sanchez the Barbarian Outcast", () => {
  test.beforeAll(async ({ request }) => {
    currentToken = (await token(request))
  })

  test("Fetch, verify and save the Barbarian class Id", async ({ request }) => {
    const classesAvailableResponse = await listClasses(request, currentToken)
    const classesAvailable = await classesAvailableResponse.json()

    await statusOK(classesAvailableResponse)
    expect(classesAvailable.length).toBe(12)
    expect(classesAvailable[0].name).toBe("Barbarian")
    expect(typeof classesAvailable[0].id).toBe("number")

    barbarianClassId = classesAvailable[0].id

    expect(barbarianClassId).toBeGreaterThanOrEqual(1)
  })

  test("Fetch, verify and save the Human species Id", async ({ request }) => {
    const speciesAvailableResponse = await listSpecies(request, currentToken)
    const speciesAvailable = await speciesAvailableResponse.json()

    await statusOK(speciesAvailableResponse)
    expect(speciesAvailable.length).toBe(10)
    expect(speciesAvailable[6].name).toBe("Human")
    expect(typeof speciesAvailable[6].id).toBe("number")

    humanSpeciesId = speciesAvailable[6].id

    expect(humanSpeciesId).toBeGreaterThanOrEqual(7)
  })

  test("Fetch, verify and save the Hermit background Id", async ({ request }) => {
    const backgroundAvailableResponse = await listBackgrounds(request, currentToken)
    const backgroundAvailable = await backgroundAvailableResponse.json()

    await statusOK(backgroundAvailableResponse)
    expect(backgroundAvailable.length).toBe(10)
    expect(backgroundAvailable[6].name).toBe("Human")
    expect(typeof backgroundAvailable[6].id).toBe("number")

    hermitBackgroundId = backgroundAvailable[6].id

    expect(hermitBackgroundId).toBeGreaterThanOrEqual(7)
  })

  let Nubya: Character = {
    name: "Nubya Sanchez",
    classId: barbarianClassId,
    speciesId: humanSpeciesId,
    backgroundId: hermitBackgroundId
  }

  test("Create Sanchez", async ({ request }) => {

    const draftCharResponse = await createChar(request, currentToken,)
  })
})
