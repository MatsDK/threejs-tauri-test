import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { sceneStateAtom } from '../../lib/store'
import { GltfModel } from './Model'
import { Target } from './Target'

export const orbitControlsRefAtom = atom<OrbitControlsImpl | null>(null)

// Z-up coordinate system
THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0, 0, 1)

export const ThreeCanvas = () => {
  const sceneState = useAtomValue(sceneStateAtom)

  const setOrbitControls = useSetAtom(orbitControlsRefAtom)
  const orbitRef = useCallback(
    (node: OrbitControlsImpl) => setOrbitControls(node),
    [],
  )

  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      camera={{ fov: 45, position: [12, 0, 6] }}
    >
      {/* <color attach='background' args={[0xdddddd]} /> */}
      {/* <color attach="background" args={[0x070707]} /> */}
      <ambientLight intensity={.5} />
      <spotLight position={[0, -20, 0]} intensity={100} color='#ffffff' />
      <spotLight position={[0, 20, 10]} intensity={100} color='#ffffff' />
      <spotLight position={[-10, 0, -10]} intensity={1} color='#ffffff' />
      <spotLight position={[-10, 0, 10]} intensity={1} color='#fff' />
      <spotLight position={[10, 0, -10]} intensity={1} color='#fff' />
      <spotLight position={[10, 0, 10]} intensity={1} color='#fff' />

      <gridHelper
        args={[40, 40, 0x222255, 0x000000]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <OrbitControls ref={orbitRef} />

      <group>
        {Array.from(sceneState.models).map(([id, model]) => (
          <Suspense fallback={null} key={id}>
            <GltfModel model={model} />
          </Suspense>
        ))}
      </group>

      <group>
        {Array.from(sceneState.targets).map(([id, target]) => (
          <Target key={id} target={target} />
        ))}
      </group>
    </Canvas>
  )
}
