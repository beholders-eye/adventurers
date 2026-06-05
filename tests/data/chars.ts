import { AbilityScores, AttributesForAChar, EquipmentChoice, SkillsForAChar } from "../schemas/chars"

const nubyaBaseAttributes: AbilityScores = {
  base: {
    STR: 17,
    DEX: 12,
    CON: 15,
    INT: 8,
    WIS: 12,
    CHA: 11
  },
  bonuses: {
    STR: 2,
    DEX: 0,
    CON: 1,
    INT: 0,
    WIS: 0,
    CHA: 0
  }
}

export const ATTRIBUTES_FOR_A_NOT_SO_GOOD_BARBARIAN: AttributesForAChar = {
  abilityScores: nubyaBaseAttributes
}

export const SKILLS_FOR_A_TRY_HARDER_BARBARIAN: SkillsForAChar = {
  skillsProficiencies: ["Animal Handling", "Athletics", "Survival"]
}

export const EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN: EquipmentChoice = {
  optionIndex: 1
}

export const BACKGROUND_EQUIPMENT_FOR_A_WE_KNOW_TO_BE_GOOD_BARBARIAN: EquipmentChoice = {
  optionIndex: 0
}

export const NUBYA: string = "Nubya Sanchez"

export const IN_PROGRESS: string = "in_progress"
export const COMPLETE: string = "complete"
export const DRAFT: string = "draft"

export const INTIMIDATION: string = "Intimidation"
export const PERCEPTION: string = "Perception"
export const SURVIVAL: string = "Survival"
export const ATHLETICS: string = "Athletics"

export const HEAVY_ARMOR: string = "Heavy Armor"

export const MARTIAL_WEAPONS: string = "Martial Weapons"
