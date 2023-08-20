import { sceneStateAtom, type Target as TargetType } from '@lib/store'
import { useSetAtom } from 'jotai'
import { useCallback, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'
import { TransformObject } from './TransformObject'

const origin = new THREE.Vector3(0, 0, 0)
const axisLines = {
  0: [origin, new THREE.Vector3(.5, 0, 0)],
  1: [origin, new THREE.Vector3(0, .5, 0)],
  2: [origin, new THREE.Vector3(0, 0, .5)],
}

interface TargetProps {
  target: TargetType
}

export const Target = ({ target }: TargetProps) => {
  const setSceneState = useSetAtom(sceneStateAtom)

  const [targetRef, setTargetRef] = useState<THREE.Group | null>(null)
  const targetCb = useCallback((node: THREE.Group) => {
    setTargetRef(node)
  }, [])

  useLayoutEffect(() => {
    if (targetRef) {
      setSceneState((prev) => {
        prev.targets.get(target.id)!.object = targetRef
        return prev
      })

      const lines = targetRef.children as THREE.Line[]
      lines.forEach((line, i) => {
        line.geometry.setFromPoints(axisLines[i as keyof typeof axisLines])
      })
    }
  }, [targetRef])

  return (
    <>
      <TransformObject object={targetRef} />

      <group
        position={target.pos || [0, 0, 0]}
        rotation={target.rot || [0, 0, 0]}
        ref={targetCb}
        renderOrder={1}
      >
        <line>
          <bufferGeometry />
          <lineBasicMaterial color='red' depthTest={false} />
        </line>
        <line>
          <bufferGeometry />
          <lineBasicMaterial color='green' depthTest={false} />
        </line>
        <line>
          <bufferGeometry />
          <lineBasicMaterial color='blue' depthTest={false} />
        </line>
      </group>
    </>
  )
}
