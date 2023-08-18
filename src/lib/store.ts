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
  object: THREE.Object3D | null
  // transformation: THREE.Matrix4 | null
}

interface SceneState {
  targets: Map<string, Target>
  models: Map<string, Model>
  // objects: any[]
}

export const sceneStateAtom = atom<SceneState>({
  targets: new Map(),
  models: new Map(),
})

export const store = createStore()

let targetId = 0
export const nextTargetId = () =>
  (targetId++).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
