import { useAtom, useAtomValue } from 'jotai'
import { type ChangeEvent, useEffect, useState } from 'react'
import * as THREE from 'three'
import { DEG2RAD } from 'three/src/math/MathUtils.js'
import { Config, Joint } from '../lib/bindings'
import { taurpc } from '../lib/ipc'
import {
  sceneStateAtom,
  selectAtom,
  selectedModelAtom,
  SidebarState,
  sidebarStateAtom,
} from '../lib/store'

export const SideBar = ({}) => {
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom)
  if (sidebarState == SidebarState.COLLAPSED) {
    return null
  }

  return (
    // <div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-[#222255] max-w-[30vw] min-w-[200px]'>
    <div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-zinc-900 max-w-[30vw] min-w-[200px] overflow-hidden'>
      {sidebarState === SidebarState.CHOOSE_MODEL
        ? <ChooseModel />
        : <ModelInfo />}
    </div>
  )
}

const ChooseModel = () => {
  const [configs, setConfigs] = useState<Config[]>([])
  const [, chooseModel] = useAtom(selectAtom)
  const [, setScene] = useAtom(sceneStateAtom)

  const getConfigs = async () => {
    try {
      const configs = await taurpc.get_configs()
      setConfigs(configs)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getConfigs()
  }, [])

  return (
    <div className='py-5'>
      <h2 className='px-5 border-b border-zinc-900 font-semibold text-lg'>
        Models
      </h2>
      <ul>
        {configs.map((config) => (
          <li
            className='mx-4 px-2 py-4 border-b border-zinc-900'
            key={config.name}
          >
            <div className='flex justify-between items-center'>
              <h1 className='font-semibold text-lg'>
                {config.name}
              </h1>
              <button
                className='bg-zinc-800 px-3 rounded-sm font-medium hover:bg-opacity-50 transition '
                onClick={() => {
                  setScene((prev) => {
                    prev.models.push({
                      config,
                      id: Math.random().toString(),
                      transformation: new THREE.Matrix4(),
                      bones: new Map(),
                    })
                    return prev
                  })
                  chooseModel(config)
                }}
              >
                Add
              </button>
            </div>
            <p className='text-gray-400'>{config.description}</p>
            <span className='text-gray-400'>
              {config.model_path}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ModelInfo = () => {
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
    // console.log(event.currentTarget.valueAsNumber)
  }

  return (
    <div>
      <h1>Model info</h1>
      {selectedModel.joints.map((joint) => {
        return (
          <div
            key={joint.id}
            className='mx-4 px-2 border-b border-zinc-800 py-2 flex flex-col'
          >
            <span>
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
                  defaultValue={0}
                  min={joint.constraints.min}
                  max={joint.constraints.max}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
