import { atom, createStore } from 'jotai'
import { Config } from './bindings'

export enum SidebarState {
  CHOOSE_MODEL,
  SCENE_INFO,
  COLLAPSED,
}

export const sidebarStateAtom = atom(SidebarState.CHOOSE_MODEL)

export const selectedModelAtom = atom<Config | null>(null)
export const selectAtom = atom(null, (_get, set, update: Config) => {
  set(selectedModelAtom, update)
  set(sidebarStateAtom, SidebarState.SCENE_INFO)
})

export interface Model {
  id: string
  config: Config
  bones: Map<string, Bone>
  object: THREE.Object3D | null
}

export interface Bone {
  boneObject: THREE.Object3D
  mesh: THREE.Object3D
}

export interface Target {
  id: string
  name: string
  transformation: THREE.Matrix4 | null
}

interface SceneState {
  targets: any[]
  models: Model[]
  // objects: any[]
}
export const sceneStateAtom = atom<SceneState>({ targets: [], models: [] })

export const store = createStore()
