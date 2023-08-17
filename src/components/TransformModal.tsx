import { atom, useAtom } from 'jotai'
import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils.js'

type TransformModalState = { active: false } | {
  active: true
  object: THREE.Object3D
  mode: 'translate' | 'rotate'
  // mode: 'translate' | 'rotate' | 'scale'
}

export const transformModalAtom = atom<TransformModalState>({ active: false })

export const TransformModal = () => {
  const [state, setState] = useAtom(transformModalAtom)

  if (!state.active) {
    return null
  }

  return (
    <div className='absolute z-10 right-2 top-0 w-64 flex flex-col bg-[#090909] border border-zinc-900 overflow-hidden text-sm'>
      <div className='flex justify-between px-2 py-px border-b border-zinc-900'>
        <h1 className='font-semibold text-sm'>
          Transform
        </h1>
        <button
          className='text-xs'
          title='Close'
          onClick={() => setState(() => ({ active: false }))}
        >
          X
        </button>
      </div>
      <div className='my-1 flex flex-col px-1'>
        <label className='text-sm px-2' htmlFor='reference-select'>
          Reference
        </label>
        <select
          name=''
          id='reference-select'
          className='bg-zinc-900 border border-zinc-600 rounded-sm'
        >
          <option value='global'>Global</option>
        </select>
      </div>
      <div
        className='my-1 px-1 flex flex-col'
        onClick={() => {
          setState((prev) => ({ ...prev, mode: 'translate' }))
        }}
      >
        <label
          className='text-sm px-1 cursor-pointer'
          htmlFor='position'
        >
          Position (X, Y, Z)
        </label>
        <div
          className='grid grid-cols-3 w-full '
          id='position'
        >
          <input
            type='number'
            className='bg-red-400 text-black border border-zinc-600 rounded-sm'
            step={.1}
            defaultValue={state.object.position.x}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.position.x = e.currentTarget.valueAsNumber
              }
            }}
          />
          <input
            type='number'
            className='bg-green-400 text-black  border border-zinc-600 rounded-sm '
            step={.1}
            defaultValue={state.object.position.y}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.position.y = e.currentTarget.valueAsNumber
              }
            }}
          />
          <input
            type='number'
            className='bg-blue-500 text-black border border-zinc-600 rounded-sm '
            step={.1}
            defaultValue={state.object.position.z}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.position.z = e.currentTarget.valueAsNumber
              }
            }}
          />
        </div>
      </div>

      <div
        className='my-1 px-1 flex flex-col '
        onClick={() => {
          setState((prev) => ({ ...prev, mode: 'rotate' }))
        }}
      >
        <label
          className='text-sm px-1 cursor-pointer'
          htmlFor='position'
        >
          Rotation deg (X, Y, Z)
        </label>
        <div
          className='grid grid-cols-3 w-full '
          id='rotation'
        >
          <input
            type='number'
            className='bg-red-400 text-black border border-zinc-600 rounded-sm'
            defaultValue={state.object.rotation.x * RAD2DEG}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.rotation.x = e.currentTarget.valueAsNumber
                  * DEG2RAD
              }
            }}
          />
          <input
            type='number'
            className='bg-green-400 text-black  border border-zinc-600 rounded-sm '
            defaultValue={state.object.rotation.y * RAD2DEG}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.rotation.y = e.currentTarget.valueAsNumber
                  * DEG2RAD
              }
            }}
          />
          <input
            type='number'
            className='bg-blue-500 text-black border border-zinc-600 rounded-sm '
            defaultValue={state.object.rotation.z * RAD2DEG}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                state.object.rotation.z = e.currentTarget.valueAsNumber
                  * DEG2RAD
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
