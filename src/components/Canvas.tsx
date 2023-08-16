import { OrbitControls, TransformControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { appLocalDataDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { useAtomValue } from 'jotai'
import { Suspense, useCallback, useEffect, useState } from 'react'
import * as THREE from 'three'
import {
  OrbitControls as OrbitControlsImpl,
  TransformControls as TransformControlsImpl,
} from 'three-stdlib'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { loadRobotModel } from '../lib/model/load'
import { Model, sceneStateAtom, selectedModelAtom } from '../lib/store'

const appLocalDataDirPath = await appLocalDataDir()

// Z-up coordinate system
THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0, 0, 1)

export const ThreeCanvas = () => {
  const selectedModel = useAtomValue(selectedModelAtom)
  const sceneState = useAtomValue(sceneStateAtom)

  const [transform, setTransform] = useState<TransformControlsImpl | null>(null)
  const transformRef = useCallback((node: TransformControlsImpl) => {
    setTransform(node)
  }, [])

  const [orbit, setOrbit] = useState<OrbitControlsImpl | null>(null)
  const orbitRef = useCallback((node: OrbitControlsImpl) => {
    setOrbit(node)
  }, [])

  useEffect(() => {
    if (transform) {
      const callback: THREE.EventListener<
        THREE.Event,
        'dragging-changed',
        TransformControlsImpl<THREE.Camera>
      > = (
        event,
      ) => {
        if (orbit) {
          orbit.enabled = !event.value
        }
      }
      transform.addEventListener('dragging-changed', callback)
      return () => transform.removeEventListener('dragging-changed', callback)
    }
  }, [orbit, transform])

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

      {/* <gridHelper args={[40, 40, 0x222222, 0x000000]} /> */}
      {/* <gridHelper args={[40, 40, 0x222255, 0xbbbbbb]} rotation={[Math.PI/2, 0, 0]}/> */}
      {/* <gridHelper args={[40, 40, 0x999999, 0xbbbbbb]} /> */}

      <TransformControls mode='translate' ref={transformRef} size={.5} />
      <OrbitControls ref={orbitRef} />

      <group>
        {sceneState.models.map(model => {
          return (
            <Suspense fallback={null} key={model.id}>
              <GltfModel model={model} />
            </Suspense>
          )
        })}
      </group>
    </Canvas>
  )
}

const GltfModel = (
  { model }: { model: Model },
) => {
  // const selectedModel = useAtomValue(selectedModelAtom)!

  // const [sceneState, setSceneState] = useAtom(sceneStateAtom)
  const modelPath = convertFileSrc(
    appLocalDataDirPath + `models\\${model.config.model_path}`,
  )

  const gltf: { scene: THREE.Group } = useLoader(GLTFLoader, modelPath)
  const [hovered, hover] = useState(false)

  const translation = new THREE.Vector3(),
    rotation = new THREE.Quaternion(),
    scale = new THREE.Vector3()
  model.transformation.decompose(translation, rotation, scale)

  useEffect(() => {
    loadRobotModel(model, gltf.scene)
  }, [gltf])

  return (
    <mesh
      rotation={new THREE.Euler().setFromQuaternion(rotation)}
      position={translation}
      scale={scale}
    >
      <primitive
        object={gltf.scene}
        // onPointerOver={(event) => hover(true)}
        // onPointerOut={(event) => hover(false)}
      />
    </mesh>
  )
}
