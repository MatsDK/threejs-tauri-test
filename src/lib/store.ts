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

export interface Model {
  id: string
  config: Config
  transformation: THREE.Matrix4
  bones: Map<string, Bone>
}

export interface Bone {
  boneObject: THREE.Object3D
  mesh: THREE.Mesh
}

export interface Target {
  id: string
  name: string
  transformation: THREE.Matrix4
}

interface SceneState {
  targets: any[]
  models: Model[]
  // objects: any[]
}
export const sceneStateAtom = atom<SceneState>({ targets: [], models: [] })
