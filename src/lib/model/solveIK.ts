import * as THREE from 'three'
import { Model } from '../store'

// TODO: Should be inside model config
const d1 = 1.723603
const d2 = 1.57888
const d3 = 0.911095 + 0.476296
const d6 = 0.330651

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

  // Get target transformation relative to the robot's base transformation.
  const relativeEndRotation = globalEndRotation.premultiply(
    baseRotation.transpose(),
  )
  const relativeEndTranslation = globalEndTranslation.sub(baseTranslation)

  // console.log('Base: ', baseRotation, baseTranslation)
  // console.log('End: ', globalEndRotation, globalEndTranslation)
  // console.log(
  //   'target relative to base',
  //   relativeEndRotation,
  //   relativeEndTranslation,
  // )

  // Get wrist position, subtract length of wrist to TCP in target y-direction, from target
  // Wx = px - d6*r12
  const Wx = relativeEndTranslation.x
    - d6 * relativeEndRotation.transpose().elements[1]!
  // Wy = py - d6*r22
  const Wy = relativeEndTranslation.y
    - d6 * relativeEndRotation.transpose().elements[4]!
  // Wz = pz - d6*r32
  const Wz = relativeEndTranslation.z
    - d6 * relativeEndRotation.transpose().elements[7]!

  const W = new THREE.Vector3(Wx, Wy, Wz)
  console.log('Wrist pos', W)

  // Calculate first 3 angles that are required to move the wrist to the position calculated above.
  const t1 = Math.atan2(W.y, W.x)
  console.log('t1', t1)

  const r = Math.sqrt(W.x ** 2 + W.y ** 2)
  const s = W.z - d1

  const solutions: Array<[number, number, number, number]> = []

  let t3 = Math.acos((r ** 2 + s ** 2 - d2 ** 2 - d3 ** 2) / (2 * d2 * d3))
  let t2 = Math.asin(
    ((d2 + d3 * Math.cos(t3)) * s - d3 * Math.sin(t3) * r) / (r ** 2 + s ** 2),
  )
  let t4 = Math.atan2(
    -Math.cos(t1) * Math.sin(t2 + t3)
        * relativeEndRotation.transpose().elements[1]!
      - Math.sin(t1) * Math.sin(t2 + t3)
        * relativeEndRotation.transpose().elements[4]!
      + Math.cos(t2 + t3) * relativeEndRotation.transpose().elements[4]!,
    Math.cos(t1) * Math.cos(t2 + t3)
        * relativeEndRotation.transpose().elements[1]!
      + Math.sin(t1) * Math.cos(t2 + t3)
        * relativeEndRotation.transpose().elements[4]!
      + Math.sin(t2 + t3) * relativeEndRotation.transpose().elements[4]!,
  )

  solutions.push([t1, t2, t3, t4])
  t3 *= -1
  t2 = Math.asin(
    ((d2 + d3 * Math.cos(t3)) * s - d3 * Math.sin(t3) * r) / (r ** 2 + s ** 2),
  )
  t4 = Math.atan2(
    -Math.cos(t1) * Math.sin(t2 + t3)
        * relativeEndRotation.transpose().elements[1]!
      - Math.sin(t1) * Math.sin(t2 + t3)
        * relativeEndRotation.transpose().elements[4]!
      + Math.cos(t2 + t3) * relativeEndRotation.transpose().elements[4]!,
    Math.cos(t1) * Math.cos(t2 + t3)
        * relativeEndRotation.transpose().elements[1]!
      + Math.sin(t1) * Math.cos(t2 + t3)
        * relativeEndRotation.transpose().elements[4]!
      + Math.sin(t2 + t3) * relativeEndRotation.transpose().elements[4]!,
  )

  solutions.push([t1, t2, t3, t4])

  console.log('solutions', solutions)

  return [W.add(baseTranslation), solutions] as const

  // return
  // model.bones.forEach((bone) => {
  //   const rot = new THREE.Matrix3().setFromMatrix4(bone.boneObject.matrix)
  //   const pos = new THREE.Vector3().applyMatrix4(bone.boneObject.matrix)
  //   console.log(
  //     bone.mesh.userData.name,
  //     rot,
  //     pos,
  //     bone.boneObject.getWorldPosition(new THREE.Vector3()),
  //   )
  // })
  // return []
}
