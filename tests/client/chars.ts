import { APIRequestContext } from "@playwright/test"
import { AbilityScores, AttributesForAChar, Character, CharacterBackground, CharacterClass, CharacterSpecies, SkillsForAChar } from "../schemas/chars";

export async function createChar(
  request: APIRequestContext,
  token: string,
  data: Character,
) {
  const response = await request.post('/api/characters', {
    headers: { Authorization: 'Bearer ' + token },
    data,
  })

  return response

}

export async function patchChar(
  request: APIRequestContext,
  token: string,
  id: number,
  scores: AttributesForAChar | SkillsForAChar | CharacterClass | CharacterSpecies | CharacterBackground

) {
  const response = await request.patch(`/api/characters/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
    data: scores
  })

  return response
}

export async function getChar(
  request: APIRequestContext,
  token: string,
  id: number
) {
  const response = await request.get(`/api/characters/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response
}

export async function getChars(
  request: APIRequestContext,
  token: string,
) {
  const response = await request.get('/api/characters', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response
}

export async function getCharAbilityScoreOptions(
  request: APIRequestContext,
  token: string,
  id: number
) {
  const response = await request.get(`/api/characters/${id}/ability-score-options`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response
}

export async function putCharAbilityScores(
  request: APIRequestContext,
  token: string,
  id: number,
  data: { [key: string]: { [key: string]: number } },
) {
  const response = await request.put(`/api/characters/${id}/ability-scores`, {
    headers: {
      Authorization: 'Bearer ' + token
    },
    data
  })

  return response
}

export async function delChar(
  request: APIRequestContext,
  token: string,
  id: number
) {
  const response = await request.delete(`/api/characters/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return response;
}
