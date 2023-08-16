import { DEG2RAD } from 'three/src/math/MathUtils.js'
import { Bone, Model, sceneStateAtom, store } from '../store'

export const loadRobotModel = (model: Model, model3D: THREE.Group) => {
  let bones: Map<string, Bone> = new Map()

  model.config.joints.forEach((joint) => {
    let boneObject = model3D.getObjectByName(joint.id)
    let mesh = model3D.getObjectByName(joint.mesh_id)

    if (!boneObject || !mesh) return

    bones.set(joint.id, {
      boneObject,
      mesh: mesh as THREE.Mesh,
    })
  })

  store.set(sceneStateAtom, (prev) => {
    prev.models[0]!.bones = bones
    return prev
  })

  homeModel(model)
}

export const homeModel = (model: Model) => {
  model.config.joints.forEach((joint) => {
    if (!joint.constraints) return

    let bone = model.bones.get(joint.id)
    if (!bone) return
    bone.boneObject.rotation[joint.constraints.axis as 'x' | 'y' | 'z'] =
      joint.constraints.home * DEG2RAD
  })
}
