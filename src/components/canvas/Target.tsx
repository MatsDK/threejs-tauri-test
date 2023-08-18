import { TransformControls } from '@react-three/drei'
import { useAtom } from 'jotai'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { LineMaterial } from 'three-stdlib'
import { sceneStateAtom, type Target as TargetType } from '../../lib/store'
import { transformModalAtom } from '../TransformModal'
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
  const targetRef = useRef<THREE.Group>(null)
  const [transformModalState, setTransformModalState] = useAtom(
    transformModalAtom,
  )
  const [sceneState, setSceneState] = useAtom(sceneStateAtom)

  useLayoutEffect(() => {
    if (targetRef.current) {
      setSceneState((prev) => {
        prev.targets.get(target.id)!.object = targetRef.current
        return prev
      })

      const lines = targetRef.current.children as THREE.Line[]
      lines.forEach((line, i) => {
        line.geometry.setFromPoints(axisLines[i as keyof typeof axisLines])
      })
    }
  }, [])

  return (
    <>
      <TransformObject object={targetRef.current} />

      <group
        ref={targetRef}
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
