import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { Config } from '../lib/bindings'
import { taurpc } from '../lib/ipc'
import { sceneStateAtom, selectAtom } from '../lib/store'

export const ImportModel = () => {
  const [configs, setConfigs] = useState<Config[]>([])
  const [, chooseModel] = useAtom(selectAtom)
  const [scene, setScene] = useAtom(sceneStateAtom)

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
                      id: THREE.MathUtils.generateUUID(),
                      object: null,
                      bones: new Map(),
                    })
                    return { ...prev }
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
