import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { Config } from '../lib/bindings'
import { taurpc } from '../lib/ipc'
import {
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
    <div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-zinc-900 max-w-[30vw] min-w-[200px]'>
      {sidebarState === SidebarState.CHOOSE_MODEL
        ? <ChooseModel />
        : <ModelInfo />}
    </div>
  )
}

const ChooseModel = () => {
  const [configs, setConfigs] = useState<Config[]>([])
  const [, chooseModel] = useAtom(selectAtom)

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
                onClick={() => chooseModel(config)}
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
  const selectedModel = useAtomValue(selectedModelAtom)

  return (
    <div>
      <h1>Model info</h1>
      <pre>
        {JSON.stringify(selectedModel, null, 2)}
      </pre>
    </div>
  )
}
