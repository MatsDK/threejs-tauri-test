import { transformModalAtom } from '@components/TransformModal'
import * as THREE from 'three'
import { DEG2RAD } from 'three/src/math/MathUtils.js'
import { Bone, Model, sceneStateAtom, store } from '../store'

export const loadRobotModel = (model: Model, armature: THREE.Object3D) => {
  let bones: Map<string, Bone> = new Map()

  model.config.joints.forEach((joint) => {
    let boneObject = armature.getObjectByName(joint.id)
    let mesh = armature.getObjectByName(joint.mesh_id)

    if (!boneObject || !mesh) return
    // if (joint.id === 'Bone0') boneObject.rotation.x = 0

    bones.set(joint.id, {
      boneObject,
      mesh,
    })
  })

  store.set(sceneStateAtom, (prev) => {
    prev.models.get(model.id)!.bones = bones
    prev.models.get(model.id)!.object = armature
    return prev
  })

  store.set(transformModalAtom, () => {
    return {
      active: true,
      object: armature,
      mode: 'translate',
      rotation: new THREE.Euler(),
      position: new THREE.Vector3(),
    }
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
