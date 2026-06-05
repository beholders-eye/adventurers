export type Character = {
  name: string
  classId?: number
  speciesId?: number
  backgroundId?: number
}

export type AttributesForAChar = {
  abilityScores: AbilityScores
}

export type SkillsForAChar = {
  skillsProficiencies: Array<string>
}

export type Attributes = {
  STR: number,
  DEX: number,
  CON: number,
  INT: number,
  WIS: number,
  CHA: number
}

export type AbilityScores = {
  base: Attributes,
  bonuses: Attributes
}

export type EquipmentChoice = {
  optionIndex: number
}
