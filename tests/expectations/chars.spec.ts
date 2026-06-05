import { expect, test } from "@playwright/test"
import { token } from "../client/authn"
import { createChar, delChar, getChar, getCharAbilityScoreOptions, getChars, patchChar } from "../client/chars"
import { listClasses } from "../client/classes"
import { statusCreated, statusOK } from "../lib/common"
import { Character, CharacterBackground, CharacterClass, CharacterSpecies } from "../schemas/chars"
import { listSpecies } from "../client/species"
import { listBackgrounds } from "../client/backgrounds"
import { ATHLETICS, ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN, BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, COMPLETE, DRAFT, EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, HEAVY_ARMOR, IN_PROGRESS, INTIMIDATION, MARTIAL_WEAPONS, NUBYA, PERCEPTION, SKILLS_FOR_A_TRY_HARDER_BARBARIAN, SURVIVAL } from "../data/chars"
import { postEquipment } from "../client/equipment"

let currentToken = ""
let charId: number = 0
let barbarianClassId: number = 0
let humanSpeciesId: number = 0
let hermitBackgroundId: number = 0

test.describe.serial("Sanchez the Barbarian Hermit Lady", () => {
  test.beforeAll(async ({ request }) => {
    currentToken = (await token(request))
  })

  test("List characters", async ({ request }) => {
    const charsResponse = await getChars(request, currentToken)
    const chars = await charsResponse.json()

    statusOK(charsResponse)

    console.log(chars)

    expect(chars.length).toBeGreaterThan(2)
    expect(chars[0].id).toBe(1675)
    expect(chars[1].id).toBe(1698)
    expect(chars[2].name).toBe("Char -- 717")

    // XXX
    await delChar(request, currentToken, 4120)
    await delChar(request, currentToken, 4121)
    await delChar(request, currentToken, 4122)
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
    expect(backgroundAvailable.length).toBe(16)
    expect(backgroundAvailable[8].name).toBe("Hermit")
    expect(typeof backgroundAvailable[8].id).toBe("number")

    hermitBackgroundId = backgroundAvailable[8].id

    expect(hermitBackgroundId).toBeGreaterThanOrEqual(10)
  })

  let Nubya: Character = {
    name: NUBYA,
  }

  test("Create Sanchez", async ({ request }) => {

    const draftCharResponse = await createChar(request, currentToken, Nubya)

    const nubyaCharacter = await draftCharResponse.json()

    charId = nubyaCharacter.id

    await statusCreated(draftCharResponse)
    expect(nubyaCharacter.status).toBe(DRAFT)
  })

  test("Sanchez basic class", async ({ request }) => {

    const classForNubya: CharacterClass = {
      classId: barbarianClassId
    }
    const classChoiceCharResponse = await patchChar(request, currentToken, charId, classForNubya)
    const classChoiceChar = await classChoiceCharResponse.json()

    statusOK(classChoiceCharResponse)
    expect(classChoiceChar.status).toBe(IN_PROGRESS)
    expect(classChoiceChar.level).toBe(1)
    expect(classChoiceChar.classId).toBe(barbarianClassId)
    expect(classChoiceChar.classDetails.slug).toBe("barbarian")
  })

  test("Sanchez species", async ({ request }) => {
    const speciesForNubya: CharacterSpecies = {
      speciesId: humanSpeciesId
    }
    const speciesChoiceCharResponse = await patchChar(request, currentToken, charId, speciesForNubya)
    const speciesChoiceChar = await speciesChoiceCharResponse.json()

    statusOK(speciesChoiceCharResponse)
    expect(speciesChoiceChar.status).toBe(IN_PROGRESS)
    expect(speciesChoiceChar.speciesId).toBe(humanSpeciesId)
  })

  test("Sanchez background", async ({ request }) => {
    const backgroundForNubya: CharacterBackground = {
      backgroundId: hermitBackgroundId
    }
    const backgroundChoiceCharResponse = await patchChar(request, currentToken, charId, backgroundForNubya)
    const backgroundChoiceChar = await backgroundChoiceCharResponse.json()

    statusOK(backgroundChoiceCharResponse)
    expect(backgroundChoiceChar.status).toBe(IN_PROGRESS)
    expect(backgroundChoiceChar.backgroundId).toBe(hermitBackgroundId)
    expect(backgroundChoiceChar.backgroundDetails.slug).toBe("hermit")

    console.log(backgroundChoiceChar)
    expect(backgroundChoiceChar.armorClass.base).toBe(10)
    expect(backgroundChoiceChar.spellcastingSummary.canCastSpells).toBeFalsy()
    expect(backgroundChoiceChar.pendingChoices.length).toBe(2)
  })

  test("Sanchez attributes", async ({ request }) => {
    const abilityScoreOptionsResponse = await getCharAbilityScoreOptions(request, currentToken, charId)
    const abilityScoreOptions = await abilityScoreOptionsResponse.json()
    console.log(abilityScoreOptions)

    const delResponse = await delChar(request, currentToken, charId)
    const del = await delResponse.json()
    console.log(del)

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

