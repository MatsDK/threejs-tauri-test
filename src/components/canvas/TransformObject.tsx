import { TransformControls } from '@react-three/drei'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { TransformControls as TransformControlsImpl } from 'three-stdlib'
import { transformModalAtom } from '../TransformModal'
import { orbitControlsRefAtom } from '.'

export const TransformObject = (
  { object }: { object: THREE.Object3D | null },
) => {
  const [transformModalState, setTransformModalState] = useAtom(
    transformModalAtom,
  )
  const orbitControls = useAtomValue(orbitControlsRefAtom)

  const [transform, setTransform] = useState<TransformControlsImpl | null>(
    null,
  )
  const transformRef = useCallback((node: TransformControlsImpl) => {
    setTransform(node)
  }, [])

  useEffect(() => {
    if (transform) {
      if (object) {
        // Sync original pos/rot with modal state
        setTransformModalState((prev) => ({
          ...prev,
          position: object.position.clone(),
          rotation: object.rotation.clone(),
        }))
      }

      const changeCb: THREE.EventListener<
        THREE.Event,
        'objectChange',
        TransformControlsImpl<THREE.Camera>
      > = (e) => {
        const object = e.target.object as THREE.Object3D

        transformModalState.active
          && transformModalState.onChange?.(
            object.rotation.clone(),
            object.position.clone(),
          )

        setTransformModalState((prev) => ({
          ...prev,
          position: object.position.clone(),
          rotation: object.rotation.clone(),
        }))
      }

      const draggingCb: THREE.EventListener<
        THREE.Event,
        'dragging-changed',
        TransformControlsImpl<THREE.Camera>
      > = (
        event,
      ) => {
        if (orbitControls) {
          orbitControls.enabled = !event.value
        }
      }

      transform.addEventListener('objectChange', changeCb)
      transform.addEventListener('dragging-changed', draggingCb)
      return () => {
        transform.removeEventListener('objectChange', changeCb)
        transform.removeEventListener('dragging-changed', draggingCb)
      }
    }
  }, [orbitControls, transform, transformModalState.onChange])

  return (
    <>
      {transformModalState.active
        && transformModalState.object.id == object?.id
        && (
          <TransformControls
            mode={transformModalState.mode}
            object={object}
            size={.5}
            ref={transformRef}
          />
        )}
    </>
  )
}
