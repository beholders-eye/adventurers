import { expect, request, test } from "@playwright/test"
import { token } from "../client/authn"
import { createChar, getChar, patchChar } from "../client/chars"
import { listClasses } from "../client/classes"
import { statusCreated, statusOK } from "../lib/common"
import { Character } from "../schemas/chars"
import { listSpecies } from "../client/species"
import { listBackgrounds } from "../client/backgrounds"
import { ATHLETICS, ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN, BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, COMPLETE, EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, HEAVY_ARMOR, IN_PROGRESS, INTIMIDATION, MARTIAL_WEAPONS, NUBYA, PERCEPTION, SKILLS_FOR_A_TRY_HARDER_BARBARIAN, SURVIVAL } from "../data/chars"
import { postEquipment } from "../client/equipment"

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
    name: NUBYA,
    classId: barbarianClassId,
    speciesId: humanSpeciesId,
    backgroundId: hermitBackgroundId
  }

  test("Create Sanchez", async ({ request }) => {

    const draftCharResponse = await createChar(request, currentToken, Nubya)

    const nubyaCharacter = await draftCharResponse.json()

    charId = nubyaCharacter.id

    await statusCreated(draftCharResponse)
    expect(nubyaCharacter.name).toBe(NUBYA)
    expect(nubyaCharacter.classId).toBe(barbarianClassId)
    expect(nubyaCharacter.speciesId).toBe(humanSpeciesId)
    expect(nubyaCharacter.backgroundId).toBe(hermitBackgroundId)
    expect(nubyaCharacter.status).toBe(IN_PROGRESS)
    expect(nubyaCharacter.level).toBe(1)
    expect(nubyaCharacter.abilityScores).toBeNull()
    expect(nubyaCharacter.skillProficiencies).toContain(INTIMIDATION)
    expect(nubyaCharacter.skillProficiencies).toContain(PERCEPTION)
    expect(nubyaCharacter.skillProficiencies).toContain(SURVIVAL)
    expect(nubyaCharacter.skillProficiencies).toContain(ATHLETICS)
    expect(nubyaCharacter.armorProficiencies).not.toContain(HEAVY_ARMOR)
    expect(nubyaCharacter.weaponProficiencies).toContain(MARTIAL_WEAPONS)
  })

  test("Sanchez attributes", async ({ request }) => {

    const attrsCharResponse = await patchChar(request, currentToken, charId, ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN)
    const attrsChar = await attrsCharResponse.json()

    await statusOK(attrsCharResponse)
    expect(attrsChar.abilityScores.final.STR).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.STR)
    expect(attrsChar.abilityScores.final.DEX).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.DEX)
    expect(attrsChar.abilityScores.final.CON).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.CON)
    expect(attrsChar.abilityScores.final.INT).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.INT)
    expect(attrsChar.abilityScores.final.WIS).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.WIS)
    expect(attrsChar.abilityScores.final.CHA).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.CHA)

    expect(attrsChar.savingThrows[0].isProficient).toBeTruthy() // STR
    expect(attrsChar.savingThrows[1].isProficient).toBeFalsy()  // DEX
    expect(attrsChar.savingThrows[2].isProficient).toBeTruthy() // CON
    expect(attrsChar.savingThrows[3].isProficient).toBeFalsy()  // INT
    expect(attrsChar.savingThrows[4].isProficient).toBeFalsy()  // WIS
    expect(attrsChar.savingThrows[5].isProficient).toBeFalsy()  // CHA

    expect(attrsChar.status).toBe(IN_PROGRESS)
  })

  test("Sanchez skills", async ({ request }) => {

    const skillsCharResponse = await patchChar(request, currentToken, charId, SKILLS_FOR_A_TRY_HARDER_BARBARIAN)
    const skillsChar = await skillsCharResponse.json()

    statusOK(skillsCharResponse)
    expect(skillsChar.skillProficiencies).toContainEqual(SKILLS_FOR_A_TRY_HARDER_BARBARIAN.skillsProficiencies)
    expect(skillsChar.skills[0].isProficient).toBeTruthy()  // Athletics
    expect(skillsChar.skills[1].isProficient).toBeFalsy()   // Acrobatics
    expect(skillsChar.skills[2].isProficient).toBeFalsy()   // Sleight of Hand
    expect(skillsChar.skills[9].isProficient).toBeTruthy()  // Animal Handling
    expect(skillsChar.skills[10].isProficient).toBeFalsy()  // Insight
    expect(skillsChar.skills[13].isProficient).toBeTruthy() // Survival

    expect(skillsChar.status).toBe(IN_PROGRESS)
  })

  test("Sanchez Equipment", async ({ request }) => {

    const equipmentCharResponse = await postEquipment(request, currentToken, charId, EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN)
    const equipmentChar = await equipmentCharResponse.json()

    statusOK(equipmentCharResponse)
    expect(equipmentChar.addedEquipment[0].name).toBe("75 GP")
    expect(equipmentChar.addedEquipment[1].isEquipped).toBeFalsy()

    expect(equipmentChar.status).toBe(IN_PROGRESS)
  })

  test("Sanchez background Equipment", async ({ request }) => {

    const bgEquipmentCharResponse = await postEquipment(request, currentToken, charId, BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN)
    const bgEquipmentChar = await bgEquipmentCharResponse.json()

    statusOK(bgEquipmentCharResponse)
    expect(bgEquipmentChar.addedEquipment[0].name).toBe("IDK")
  })

  test("Sanchez is complete", async ({ request }) => {
    const sanchezIsBornResponse = await getChar(request, currentToken, charId)
    const sanchezIsBorn = await sanchezIsBornResponse.json()

    statusOK(sanchezIsBornResponse)

    expect(sanchezIsBorn.status).toBe(COMPLETE)
  })
})
