import { APIRequestContext } from "@playwright/test"
import { EquipmentChoice } from "../schemas/chars"

export async function postEquipment(
  request: APIRequestContext,
  token: string,
  charId: number,
  data: EquipmentChoice
) {
  const response = await request.post(`/api/characters/${charId}/equipment/class-choice`, {
    headers: { Authorization: 'Bearer ' + token },
    data,
  })

  return response

}

export async function postBackgroundEquipment(
  request: APIRequestContext,
  token: string,
  charId: number,
  data: EquipmentChoice
) {
  const response = await request.post(`/api/characters/${charId}/equipment/background-choice`, {
    headers: { Authorization: 'Bearer ' + token },
    data,
  })

  return response

}

