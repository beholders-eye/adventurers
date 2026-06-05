export type Character = {
  name: string
}

export type CharacterClass = {
  classId: number
}

export type CharacterSpecies = {
  speciesId: number
}

export type CharacterBackground = {
  backgroundId: number
}

export type AttributesForAChar = {
  abilityScores: AbilityScores
}

export type SkillsForAChar = {
  skills: Array<string>,
  skillsProficiencies: Array<string>,
  classDetails: ClassProficiency,
  backgroundDetails: BDProficiency
}

export type ClassProficiency = {
  skillProficiencyChoices: Array<string>,
}
export type BDProficiency = {
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
