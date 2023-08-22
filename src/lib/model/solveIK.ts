import * as THREE from 'three'
import { Model } from '../store'

export const solve = (Tend: number[], model: Model) => {
  const end = new THREE.Matrix4().fromArray(Tend)
  const globalEndRotation = new THREE.Matrix3().setFromMatrix4(end)
  const globalEndTranslation = new THREE.Vector3().applyMatrix4(end)

  const baseTransformation = model.object?.matrix!
  const baseRotation = new THREE.Matrix3().setFromMatrix4(
    new THREE.Matrix4().makeRotationFromQuaternion(
      model.object!.getWorldQuaternion(new THREE.Quaternion()),
    ),
  )
  const baseTranslation = model.object?.getWorldPosition(new THREE.Vector3())!

  const relativeEndRotation = globalEndRotation.premultiply(
    baseRotation.transpose(),
  )
  const relativeEndTranslation = globalEndTranslation.sub(baseTranslation)

  // console.log('Base: ', baseRotation, baseTranslation)
  // console.log('End: ', globalEndRotation, globalEndTranslation)
  console.log(
    'target relative to base',
    relativeEndRotation,
    relativeEndTranslation,
  )

  return
  model.bones.forEach((bone) => {
    const rot = new THREE.Matrix3().setFromMatrix4(bone.boneObject.matrix)
    const pos = new THREE.Vector3().applyMatrix4(bone.boneObject.matrix)
    console.log(
      bone.mesh.userData.name,
      rot,
      pos,
      bone.boneObject.getWorldPosition(new THREE.Vector3()),
    )
  })
  return []
}
