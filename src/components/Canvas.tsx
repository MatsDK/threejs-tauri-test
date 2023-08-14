import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { appLocalDataDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { useAtomValue } from 'jotai'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { selectedModelAtom } from '../lib/store'

const appLocalDataDirPath = await appLocalDataDir()

export const ThreeCanvas = () => {
  const selectedModel = useAtomValue(selectedModelAtom)
  // console.log(selectedModel, appLocalDataDirPath + `models\\${selectedModel?.model_path}`,)

  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      camera={{ fov: 45, position: [0, 5, 10] }}
    >
      {/* <color attach="background" args={[0xdddddd]} /> */}
      {/* <color attach="background" args={[0x070707]} /> */}
      <ambientLight intensity={.5} />
      <spotLight position={[0, -20, 0]} intensity={100} color='#ffffff' />
      <spotLight position={[0, 20, 10]} intensity={100} color='#ffffff' />
      <spotLight position={[-10, 0, -10]} intensity={1} color='#ffffff' />
      <spotLight position={[-10, 0, 10]} intensity={1} color='#fff' />
      <spotLight position={[10, 0, -10]} intensity={1} color='#fff' />
      <spotLight position={[10, 0, 10]} intensity={1} color='#fff' />
      <OrbitControls target={[0, 0, 0]} />

      <gridHelper args={[40, 40, 0x222255, 0x000000]} />
      {/* <gridHelper args={[40, 40, 0x222222, 0x000000]} /> */}
      {/* <gridHelper args={[40, 40, 0x222255, 0xbbbbbb]} /> */}
      {/* <gridHelper args={[40, 40, 0x999999, 0xbbbbbb]} /> */}

      {selectedModel && (
        <Suspense fallback={null}>
          <GltfModel />
        </Suspense>
      )}
    </Canvas>
  )
}

const GltfModel = () => {
  const selectedModel = useAtomValue(selectedModelAtom)
  const modelPath = convertFileSrc(
    appLocalDataDirPath + `models\\${selectedModel?.model_path}`,
  )

  const position = [0, 0, 0]
  const joint1 = useRef<THREE.Object3D>()
  const joint2 = useRef<THREE.Object3D>()
  const joint3 = useRef<THREE.Object3D>()
  const gltf: { scene: THREE.Group } = useLoader(GLTFLoader, modelPath)
  const [hovered, hover] = useState(false)

  useEffect(() => {
    if (joint1.current && joint2.current) return
    let bone0 = gltf.scene.getObjectByName('Bone0')!
    let bone1 = gltf.scene.getObjectByName('Bone1')!
    let bone2 = gltf.scene.getObjectByName('Bone2')!
    let bone3 = gltf.scene.getObjectByName('Bone3')!
    // let b1 = new THREE.Bone()
    // b1.position.y = bone0.position.y
    // // b1.(bone0)
    // let b2 = new THREE.Bone()
    // b2.position.y = bone1.position.y
    // // b2.add(bone1)
    // let b3 = new THREE.Bone()
    // b3.position.y = bone2.position.y
    // // b3.add(bone2)
    // let base = gltf.scene.getObjectByName("Base")
    // if (base) {
    //   base.material = new THREE.MeshStandardMaterial({})
    //   console.log(base.material)
    // }
    // let arm1 = gltf.scene.getObjectByName("Shoulder")
    // if (arm1) {
    //   arm1.material = new THREE.MeshStandardMaterial({})
    //   console.log(arm1.material)
    // }
    // let arm2 = gltf.scene.getObjectByName("Arm")
    // if (arm2) {
    //   arm2.material = new THREE.MeshStandardMaterial()
    //   console.log(arm2.material)
    // }
    joint1.current = gltf.scene.getObjectByName('Bone1')
    joint2.current = gltf.scene.getObjectByName('Bone2')
    joint3.current = gltf.scene.getObjectByName('Bone3')
  }, [gltf])

  useFrame((state, delta) => {
    if (joint1.current) {
      // ref.current.rotation.y += 0.003
      joint1.current.rotation.y += 0.001
      // console.log("joint1", joint1.current.getWorldQuaternion(new THREE.Quaternion()))
    }
    if (joint2.current) {
      joint2.current.rotation.x = (joint2.current.rotation.x + 0.001)
        % (Math.PI / 2)
      // console.log("joint2", joint2.current.getWorldQuaternion(new THREE.Quaternion()))
    }
    if (joint3.current) {
      joint3.current.rotation.x = (joint3.current.rotation.x + 0.001)
        % (Math.PI / 2)
      // console.log("joint3", joint3.current.getWorldQuaternion(new THREE.Quaternion()))
    }
  })

  return (
    <>
      <primitive
        object={gltf.scene}
        // position={position}
        // onPointerOver={(event) => hover(true)}
        // onPointerOut={(event) => hover(false)}
      />
    </>
  )
}
