import { solve } from '@/lib/model/solveIK'
import { nextTargetId, sceneStateAtom, selectedModelAtom } from '@lib/store'
import { useAtom, useAtomValue } from 'jotai'
import * as THREE from 'three'
import { transformModalAtom } from './TransformModal'

export const TargetList = () => {
  const [sceneState, setSceneState] = useAtom(sceneStateAtom)
  const [transformModalState, setTransformModalState] = useAtom(
    transformModalAtom,
  )
  const selectedModel = useAtomValue(selectedModelAtom)

  return (
    <div>
      <div className='px-2 w-full text-sm font-semibold border-y m-0 border-zinc-800 flex flex-row flex-1 justify-between'>
        <span>
          Targets
        </span>
        <button
          onClick={() => {
            if (!selectedModel) return
            let bones = selectedModel.bones
            if (!bones) return
            let pos = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldPosition(new THREE.Vector3())!

            let q = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldQuaternion(new THREE.Quaternion())
            let rot = new THREE.Euler().setFromQuaternion(
              q!,
            )

            // Offset because of Z-up coordinate system? Bone0 is rotated 90deg
            // rot.x -= Math.PI / 2

            let tcp_offset = new THREE.Vector3(
              0,
              selectedModel.config.tcp_offset[2],
              0,
            )
              .applyEuler(rot)

            // Add rotated tcp offset vector to target pos
            pos.add(tcp_offset)

            setSceneState((prev) => {
              const id = THREE.MathUtils.generateUUID()
              prev.targets.set(id, {
                id,
                name: `Target${nextTargetId()}`,
                object: null,
                pos,
                rot,
              })
              return { ...prev }
            })
          }}
        >
          Teach target
        </button>
        <button
          onClick={() => {
            setSceneState((prev) => {
              const id = THREE.MathUtils.generateUUID()
              prev.targets.set(id, {
                id,
                name: `Target${nextTargetId()}`,
                object: null,
              })
              return { ...prev }
            })
          }}
        >
          +
        </button>
      </div>
      <ul>
        {Array.from(sceneState.targets).map(([id, target]) => (
          <li key={id} className='flex gap-2 py-1 text-sm px-2'>
            <span>
              {target.name}
            </span>

            <div className='flex gap-2'>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => {
                  setTransformModalState((prev) => ({
                    active: true,
                    mode: 'translate',
                    object: target.object!,
                    rotation: new THREE.Euler(),
                    position: new THREE.Vector3(),
                  }))
                }}
              >
                Translate
              </button>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => {
                  setTransformModalState((prev) => ({
                    active: true,
                    mode: 'rotate',
                    object: target.object!,
                    rotation: new THREE.Euler(),
                    position: new THREE.Vector3(),
                  }))
                }}
              >
                Rotate
              </button>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => {
                  if (target.object?.matrix.elements && selectedModel) {
                    const [W, solutions] = solve(
                      target.object?.matrix.elements,
                      selectedModel,
                    )

                    const [t1, t2, t3] = solutions[1]!

                    setSceneState((prev) => {
                      const id = THREE.MathUtils.generateUUID()
                      prev.targets.set(id, {
                        id,
                        name: `Target${nextTargetId()}`,
                        object: null,
                        pos: W,
                      })
                      return { ...prev }
                    })

                    selectedModel.config.joints.forEach((joint) => {
                      console.log(joint)
                      const bone = selectedModel.bones.get(joint.id)
                      if (!bone) {
                        return
                      }
                      if (joint.id === 'Bone1') {
                        bone.boneObject.rotation.y = t1!
                      } else if (joint.id === 'Bone2') {
                        // bone.boneObject.rotation.x = t2!
                        bone.boneObject.rotation.x = Math.PI / 2 - t2!
                      } else if (joint.id === 'Bone3') {
                        // bone.boneObject.rotation.x = t3!
                        bone.boneObject.rotation.x = -t3!
                      }
                    })
                  }
                }}
              >
                Robot at target
              </button>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => {
                  setSceneState((prev) => {
                    prev.targets.delete(id)
                    return { ...prev }
                  })

                  if (
                    transformModalState.active
                    && transformModalState.object.id == target.object?.id
                  ) {
                    setTransformModalState({ active: false })
                  }
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
