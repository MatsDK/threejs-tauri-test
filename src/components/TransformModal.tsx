import { atom, useAtom } from 'jotai'
import { FormEvent, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DEG2RAD, RAD2DEG } from 'three/src/math/MathUtils.js'

type TransformModalState = { active: false; onChange?: () => void } | {
  active: true
  object: THREE.Object3D
  mode: 'translate' | 'rotate'
  position: THREE.Vector3
  rotation: THREE.Euler
  onChange?: (rot: THREE.Euler, pos: THREE.Vector3) => void
}

export const transformModalAtom = atom<TransformModalState>({ active: false })

export const TransformModal = () => {
  const [state, setState] = useAtom(transformModalAtom)

  if (!state.active) {
    return null
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()

    // Apply input values to Object3D
    state.object.rotation.copy(state.rotation)
    state.object.position.copy(state.position)

    state.onChange?.(state.object.rotation, state.object.position)
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
          Translation (X, Y, Z)
        </label>
        <form
          id='position'
          className='grid grid-cols-3 w-full '
          onSubmit={submit}
        >
          <Input mode='translate' axis='x' />
          <Input mode='translate' axis='y' />
          <Input mode='translate' axis='z' />
          <button className='hidden' type='submit'></button>
        </form>
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

        <form
          id='rotation'
          className='grid grid-cols-3 w-full '
          onSubmit={submit}
        >
          <Input mode='rotate' axis='x' />
          <Input mode='rotate' axis='y' />
          <Input mode='rotate' axis='z' />
          <button className='hidden' type='submit'></button>
        </form>
      </div>
    </div>
  )
}

interface InputProps {
  mode: 'translate' | 'rotate'
  axis: 'x' | 'y' | 'z'
}

const inputColors = {
  'x': 'bg-red-400',
  'y': 'bg-green-400',
  'z': 'bg-blue-500',
}

const Input = ({ axis, mode }: InputProps) => {
  const [state, setState] = useAtom(transformModalAtom)

  const inputRef = useRef<HTMLInputElement>(null)

  const m = mode === 'rotate' ? 'rotation' : 'position'

  useEffect(() => {
    if (!state.active || !inputRef.current) return
    inputRef.current.valueAsNumber =
      (mode === 'rotate' ? state[m][axis] * RAD2DEG : state[m][axis]) || 0
  }, [state])

  if (!state.active) return null

  const defaultValue = () => {
    if (mode === 'rotate') return state.rotation[axis] * RAD2DEG
    state.position[axis]
  }

  return (
    <input
      type='number'
      className={`${
        inputColors[axis]
      } text-black border border-zinc-600 rounded-sm`}
      step='any'
      onChange={(e) => {
        // TODO: fix weird cursor behaviour with decimal points
        const value = e.currentTarget.valueAsNumber

        const position = state.position
        const rotation = state.rotation
        if (mode === 'translate') {
          if (axis === 'x') {
            position.setX(value)
          } else if (axis === 'y') {
            position.setY(value)
          } else if (axis === 'z') {
            position.setZ(value)
          }
        } else if (mode === 'rotate') {
          if (axis === 'x') {
            rotation.x = value * DEG2RAD
          } else if (axis === 'y') {
            rotation.y = value * DEG2RAD
          } else if (axis === 'z') {
            rotation.z = value * DEG2RAD
          }
        }

        setState((prev) => ({ ...prev, position, rotation }))
      }}
      defaultValue={defaultValue()}
      ref={inputRef}
    />
  )
}
