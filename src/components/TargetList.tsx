import { nextTargetId, sceneStateAtom } from '@lib/store'
import { useAtom } from 'jotai'
import * as THREE from 'three'
import { transformModalAtom } from './TransformModal'

export const TargetList = () => {
  const [sceneState, setSceneState] = useAtom(sceneStateAtom)
  const [transformModalState, setTransformModalState] = useAtom(
    transformModalAtom,
  )

  return (
    <div>
      <div className='px-2 w-full text-sm font-semibold border-y m-0 border-zinc-800 flex flex-row flex-1 justify-between'>
        <span>
          Targets
        </span>
        <button
          onClick={() => {
            const model = Array.from(sceneState.models)[0]?.[1]!
            let bones = model.bones
            if (!bones) return
            let pos = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldPosition(new THREE.Vector3())!

            let q = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldQuaternion(new THREE.Quaternion())
            let rot = new THREE.Euler().setFromQuaternion(
              q!,
              'ZYX',
            )

            // Offset because of Z-up coordinate system? Bone0 is rotated 90deg
            rot.x -= Math.PI / 2

            let tcp_offset = new THREE.Vector3(...model.config.tcp_offset)
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
          <li key={id}>
            {target.name}
            <button
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
          </li>
        ))}
      </ul>
    </div>
  )
}
