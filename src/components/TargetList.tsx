import { useAtom } from 'jotai'
import * as THREE from 'three'
import { nextTargetId, sceneStateAtom } from '../lib/store'
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
            let bones = Array.from(sceneState.models)[0]?.[1].bones
            if (!bones) return
            let x = new THREE.Vector3()
            let pos = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldPosition(x)

            let q = Array.from(bones).at(-1)?.[1].boneObject
              .getWorldQuaternion(new THREE.Quaternion())
            let rot = new THREE.Euler().setFromQuaternion(q!)

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
