import { Joint } from '@lib/bindings'
import { homeModel } from '@lib/model/load'
import { Model, sceneStateAtom, selectedModelIdAtom } from '@lib/store'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ChangeEvent } from 'react'
import * as THREE from 'three'
import { DEG2RAD } from 'three/src/math/MathUtils.js'
import { transformModalAtom } from './TransformModal'

export const RobotControllerList = () => {
  const sceneState = useAtomValue(sceneStateAtom)!
  const setTransformModal = useSetAtom(transformModalAtom)
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom)

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
            <h1
              onClick={() => {
                setSelectedModelId(id)
              }}
              className='font-semibold text-md'
            >
              {model.config.name}
            </h1>
            <div className='flex gap-2'>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
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
              </button>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
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
              </button>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => {
                  setTransformModal((prev) => ({
                    active: true,
                    mode: 'rotate',
                    object: model.object!,
                    rotation: new THREE.Euler(),
                    position: new THREE.Vector3(),
                    onChange: (rot, pos) => {
                      console.log(rot, pos)
                    },
                  }))
                }}
              >
                Move TCP
              </button>
            </div>
            <span>Tools</span>
            <div className='flex justify-between pr-2'>
              <span>Joints</span>
              <button
                className='bg-zinc-800 bg-opacity-40 border border-zinc-800 rounded-md px-2'
                onClick={() => homeModel(model!)}
              >
                Home
              </button>
            </div>
            {model.config.joints.filter(({ constraints }) => !!constraints)
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
