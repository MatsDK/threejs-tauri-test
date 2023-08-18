import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ChangeEvent } from 'react'
import * as THREE from 'three'
import { DEG2RAD, generateUUID } from 'three/src/math/MathUtils.js'
import { Joint } from '../lib/bindings'
import { homeModel } from '../lib/model/load'
import {
  Model,
  nextTargetId,
  sceneStateAtom,
  selectedModelAtom,
} from '../lib/store'
import { transformModalAtom } from './TransformModal'

export const SceneLayout = () => {
  const sceneState = useAtomValue(sceneStateAtom)!

  return (
    <div className='flex flex-col '>
      <RobotControllerList />
      <TargetList />
    </div>
  )
}

const TargetList = () => {
  const [sceneState, setSceneState] = useAtom(sceneStateAtom)
  const setTransformModalState = useSetAtom(transformModalAtom)

  return (
    <div>
      <div className='px-2 w-full text-sm font-semibold border-y m-0 border-zinc-800 flex flex-row flex-1 justify-between'>
        <span>
          Targets
        </span>
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
          </li>
        ))}
      </ul>
    </div>
  )
}

const RobotControllerList = () => {
  const selectedModel = useAtomValue(selectedModelAtom)!
  const sceneState = useAtomValue(sceneStateAtom)!
  const setTransformModal = useSetAtom(transformModalAtom)

  const handleAngleChange = (
    event: ChangeEvent<HTMLInputElement>,
    model: Model,
    joint: Joint,
  ) => {
    if (!joint.constraints) return

    let bone = model.bones.get(joint.id)
    if (!bone) return

    bone.boneObject.rotation[joint.constraints.axis as 'x' | 'y' | 'z'] =
      event.currentTarget.valueAsNumber * DEG2RAD
  }

  return (
    <>
      <div className='pl-2 w-full text-sm font-semibold border-y  m-0 border-zinc-800 flex flex-row flex-1'>
        <span>
          Robot controllers
        </span>
      </div>
      <div className='flex flex-col pl-2 text-sm'>
        {Array.from(sceneState.models).map(([id, model]) => (
          <div key={id}>
            <h1 className='font-semibold text-md'>{model.config.name}</h1>
            <span
              onClick={() => {
                setTransformModal((prev) => ({
                  active: true,
                  mode: 'translate',
                  object: model.object!,
                  rotation: new THREE.Euler(),
                  position: new THREE.Vector3(),
                }))
              }}
            >
              Move
            </span>
            <span
              onClick={() => {
                setTransformModal((prev) => ({
                  active: true,
                  mode: 'rotate',
                  object: model.object!,
                  rotation: new THREE.Euler(),
                  position: new THREE.Vector3(),
                }))
              }}
            >
              Rotate
            </span>
            <span>Tools</span>
            <div className='flex justify-between'>
              <span>Joints</span>
              <button onClick={() => homeModel(model!)}>
                Home
              </button>
            </div>
            {selectedModel.joints.filter(({ constraints }) => !!constraints)
              .map(
                (joint) => {
                  return (
                    <div
                      key={joint.id}
                      className='mx-4 border-b border-zinc-800  flex flex-col'
                    >
                      <span className='text-sm'>
                        {joint.name}
                      </span>
                      {joint.constraints && (
                        <div className='flex w-full'>
                          <label>{joint.constraints.axis}</label>
                          <input
                            onChange={(e) => handleAngleChange(e, model, joint)}
                            type='range'
                            name=''
                            className='flex-1'
                            id=''
                            defaultValue={joint.constraints.home}
                            min={joint.constraints.min}
                            max={joint.constraints.max}
                          />
                        </div>
                      )}
                    </div>
                  )
                },
              )}
          </div>
        ))}
      </div>
    </>
  )
}
