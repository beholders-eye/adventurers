import { expect, test } from "@playwright/test"
import { token } from "../client/authn"
import { createChar, delChar, getChar, getCharAbilityScoreOptions, getChars, patchChar, putCharAbilityScores } from "../client/chars"
import { listClasses } from "../client/classes"
import { statusCreated, statusOK } from "../lib/common"
import { Character, CharacterBackground, CharacterClass, CharacterSpecies } from "../schemas/chars"
import { listSpecies } from "../client/species"
import { listBackgrounds } from "../client/backgrounds"
import { ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN, BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, COMPLETE, DRAFT, EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN, IN_PROGRESS, NUBYA, SKILLS_FOR_A_TRY_HARDER_BARBARIAN } from "../data/chars"
import { postBackgroundEquipment, postEquipment } from "../client/equipment"

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

    let response = await delChar(request, currentToken, 4193)
    response = await delChar(request, currentToken, 4194)
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

    expect(backgroundChoiceChar.armorClass.base).toBe(10)
    expect(backgroundChoiceChar.spellcastingSummary.canCastSpells).toBeFalsy()
    expect(backgroundChoiceChar.pendingChoices.length).toBe(2)
  })

  test("Sanchez attributes", async ({ request }) => {
    const abilityScoreOptionsResponse = await getCharAbilityScoreOptions(request, currentToken, charId)
    const abilityScoreOptions = await abilityScoreOptionsResponse.json()

    statusOK(abilityScoreOptionsResponse)
    expect(abilityScoreOptions.selectionRules.source).toBe("background")
    expect(abilityScoreOptions.backgroundName).toBe("Hermit")
    expect(abilityScoreOptions.selectionRules.allowedChoices[0]).toBe("CON")
    expect(abilityScoreOptions.selectionRules.allowedChoices[1]).toBe("WIS")
    expect(abilityScoreOptions.selectionRules.allowedChoices[2]).toBe("CHA")

    // const attrsCharResponse = await putCharAbilityScores(request, currentToken, charId, BASE_AND_BONUSES_FOR_THIS_LADY)
    // const attrsChar = await attrsCharResponse.json()
    // console.log("Trying to PUT ability scores resp:")
    // console.log(attrsChar)


    const patchAbilityScoresResponse = await patchChar(request, currentToken, charId, ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN)
    const patchAbilityScores = await patchAbilityScoresResponse.json()

    await statusOK(patchAbilityScoresResponse)

    expect(patchAbilityScores.abilityScores.final.STR).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.STR)
    expect(patchAbilityScores.abilityScores.final.DEX).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.DEX)
    expect(patchAbilityScores.abilityScores.final.CON).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.CON + 2)
    expect(patchAbilityScores.abilityScores.final.INT).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.INT)
    expect(patchAbilityScores.abilityScores.final.WIS).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.WIS)
    expect(patchAbilityScores.abilityScores.final.CHA).toBe(ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN.abilityScores.base.CHA + 1)

    expect(patchAbilityScores.savingThrows[0].isProficient).toBeTruthy() // STR
    expect(patchAbilityScores.savingThrows[1].isProficient).toBeFalsy()  // DEX
    expect(patchAbilityScores.savingThrows[2].isProficient).toBeTruthy() // CON
    expect(patchAbilityScores.savingThrows[3].isProficient).toBeFalsy()  // INT
    expect(patchAbilityScores.savingThrows[4].isProficient).toBeFalsy()  // WIS
    expect(patchAbilityScores.savingThrows[5].isProficient).toBeFalsy()  // CHA

    expect(patchAbilityScores.status).toBe(IN_PROGRESS)

  })

  test("Sanchez skills", async ({ request }) => {

    const skillsCharResponse = await patchChar(request, currentToken, charId, SKILLS_FOR_A_TRY_HARDER_BARBARIAN)
    const skillsChar = await skillsCharResponse.json()

    statusOK(skillsCharResponse)
    expect(skillsChar.skills[0].isProficient).toBeTruthy()  // Athletics
    expect(skillsChar.skills[1].isProficient).toBeFalsy()   // Acrobatics
    expect(skillsChar.skills[2].isProficient).toBeFalsy()   // Sleight of Hand
    expect(skillsChar.skills[8].isProficient).toBeTruthy()  // Religion
    expect(skillsChar.skills[10].isProficient).toBeFalsy()  // Insight
    expect(skillsChar.skills[11].isProficient).toBeTruthy() // Medicine
    expect(skillsChar.skills[13].isProficient).toBeTruthy() // Survival

    expect(skillsChar.status).toBe(IN_PROGRESS)

  })

  test("Sanchez equipment", async ({ request }) => {

    const equipmentCharResponse = await postEquipment(request, currentToken, charId, EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN)
    const equipmentChar = await equipmentCharResponse.json()


    statusOK(equipmentCharResponse)
    expect(equipmentChar.addedCurrency.gp).toBe(75)

  })

  test("Sanchez background equipment", async ({ request }) => {

    const bgEquipmentCharResponse = await postBackgroundEquipment(request, currentToken, charId, BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN)
    const bgEquipmentChar = await bgEquipmentCharResponse.json()

    statusOK(bgEquipmentCharResponse)
    expect(bgEquipmentChar.addedEquipment[0].name).toBe("Quarterstaff")
  })

  test("Sanchez is complete", async ({ request }) => {
    const sanchezIsBornResponse = await getChar(request, currentToken, charId)
    const sanchezIsBorn = await sanchezIsBornResponse.json()
    // console.log(sanchezIsBorn)

    statusOK(sanchezIsBornResponse)

    expect(sanchezIsBorn.backgroundDetails.feat).toBe("Healer")
    expect(sanchezIsBorn.backgroundDetails.toolProficiency).toBe("Herbalism Kit")
    expect(sanchezIsBorn.speciesDetails.speed).toBe(30)
    expect(sanchezIsBorn.classDetails.subclasses.length).toBe(4)
    expect(sanchezIsBorn.classDetails.subclasses[2]).toBe("World Tree")
    expect(sanchezIsBorn.classDetails.role).toBe("melee")
    expect(sanchezIsBorn.classDetails.spellcasting).toBeNull()
    expect(sanchezIsBorn.weaponAttacks[0].name).toBe("Quarterstaff")
    expect(sanchezIsBorn.weaponAttacks[0].attackBonus).toBe(4)
    expect(sanchezIsBorn.weaponAttacks[0].damage).not.toBeNull()
    expect(sanchezIsBorn.weaponAttacks[0].damage.formula).toBe("1d6 + 2")
    expect(sanchezIsBorn.weaponAttacks[0].damage.damageType).toBe("Bludgeoning")

    expect(sanchezIsBorn.status).toBe(COMPLETE)

    console.log(`Character Id: ${sanchezIsBorn.id}`)
  })

  test("Delete Sanchez", { tag: ["@delete"] }, async ({ request }) => {
    const delResponse = await delChar(request, currentToken, charId)

    statusOK(delResponse)
  })
})

