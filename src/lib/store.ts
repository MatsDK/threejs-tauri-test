import { atom } from 'jotai'
import { Config } from './bindings'

export enum SidebarState {
  CHOOSE_MODEL,
  MODEL_INFO,
  COLLAPSED,
}

export const sidebarStateAtom = atom(SidebarState.CHOOSE_MODEL)

export const selectedModelAtom = atom<Config | null>(null)
export const selectAtom = atom(null, (_get, set, update: Config) => {
  set(selectedModelAtom, update)
  set(sidebarStateAtom, SidebarState.MODEL_INFO)
})
