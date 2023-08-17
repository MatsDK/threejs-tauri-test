import { useAtomValue } from 'jotai'
import { ChangeEvent } from 'react'
import * as THREE from 'three'
import { DEG2RAD } from 'three/src/math/MathUtils.js'
import { Joint } from '../lib/bindings'
import { homeModel } from '../lib/model/load'
import { sceneStateAtom, selectedModelAtom } from '../lib/store'

export const SceneLayout = () => {
  const sceneState = useAtomValue(sceneStateAtom)!

  return (
    <div className='flex flex-col '>
      <RobotControllers />
    </div>
  )
}

const RobotControllers = () => {
  const selectedModel = useAtomValue(selectedModelAtom)!
  const sceneState = useAtomValue(sceneStateAtom)!

  const handleAngleChange = (
    event: ChangeEvent<HTMLInputElement>,
    joint: Joint,
  ) => {
    if (!joint.constraints) return

    let bone = sceneState.models[0]!.bones.get(joint.id)
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
      <div className='flex flex-col'>
        <span>Tools</span>
        <div>
          <span>Joints</span>
          <button onClick={() => homeModel(sceneState.models[0]!)}>Home</button>
        </div>
        {selectedModel.joints.filter(({ constraints }) => !!constraints).map(
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
                      onChange={(e) => handleAngleChange(e, joint)}
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
    </>
  )
}
