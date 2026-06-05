import { AttributeValidationParameters } from "../schemas/attrs"

export const ATTRIBUTE_TESTS: Array<AttributeValidationParameters> = [
  {
    index: 0, id: 1, name: 'Strength', shortname: 'STR',
    description: 'physical power', firstSkill: 'Athletics'
  },
  {
    index: 1, id: 2, name: 'Dexterity', shortname: 'DEX',
    description: 'affects actions that require speed, precision, and stealth', firstSkill: 'Acrobatics'
  },
  {
    index: 2, id: 3, name: 'Constitution', shortname: 'CON',
    description: 'commonly associated with health, stamina, and resistance', firstSkill: ''
  },
  {
    index: 3, id: 4, name: 'Intelligence', shortname: 'INT',
    description: 'linked to learning, investigation, and logical', firstSkill: 'Arcana'
  },
  {
    index: 4, id: 5, name: 'Wisdom', shortname: 'WIS',
    description: 'good judgment. It reflects how well a character understands the', firstSkill: 'Animal Handling'
  },
  {
    index: 5, id: 6, name: 'Charisma', shortname: 'CHA',
    description: 'confidence, influence, and social impact. It affects persuasion, leadership, and interpersonal interactions.', firstSkill: 'Deception'
  }
]
