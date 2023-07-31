import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from "three";
import { type Mesh } from 'three';
import "./App.css";
import { taurpc } from "./ipc";
import { Stats, OrbitControls } from '@react-three/drei'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GltfModel = () => {
  const modelPath = "/model2.glb"
  const position = [0, 0, 0];
  const joint1 = useRef<Mesh>();
  const joint2 = useRef<Mesh>();
  const gltf = useLoader(GLTFLoader, modelPath);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    if (joint1.current && joint2.current) return
    joint1.current = gltf.scene.getObjectByName("Bone1")

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
    joint2.current = gltf.scene.getObjectByName("Bone2")
  }, [gltf])

  useFrame((state, delta) => {
    if (joint1.current) {
      // ref.current.rotation.y += 0.003
      joint1.current.rotation.y += 0.001
    }
    if (joint2.current) {
      joint2.current.rotation.x = (joint2.current.rotation.x + 0.001) % (Math.PI / 2)
    }
  });

  console.log(gltf)

  return (
    <>
      <primitive

        object={gltf.scene}
        position={position}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
      >

      </primitive>
      {/* <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} /> */}
    </>
  );
};

function App() {

  // async function greet() {
  //   await taurpc._hello_world_()
  // }

  // useEffect(() => {
  //   const unlisten = taurpc._hello_world_.on(() => {
  //     console.log("hello world event triggered")
  //   })

  //   return () => unlisten()
  // }, [])

  return (
    <Canvas style={{
      width: "100vw",
      height: "100vh",
    }}

      camera={{ fov: 45, position: [0, 5, 10] }}
    >
      {/* <color attach="background" args={[0xdddddd]} /> */}
      <color attach="background" args={[0x070707]} />
      <ambientLight intensity={1} />
      <spotLight position={[0, -20, 0]} intensity={100} color="#ffffff" />
      <spotLight position={[0, 20, 10]} intensity={100} color="#ffffff" />
      <spotLight position={[-10, 0, -10]} intensity={1} color="#ffffff" />
      <spotLight position={[-10, 0, 10]} intensity={1} color="#fff" />
      <spotLight position={[10, 0, -10]} intensity={1} color="#fff" />
      <spotLight position={[10, 0, 10]} intensity={1} color="#fff" />
      <OrbitControls target={[0, 0, 0]} />
      <Stats />
      <Suspense fallback={null}>
        <GltfModel />
        <gridHelper args={[40, 40, 0x222255, 0x000000]} />
        {/* <gridHelper args={[40, 40, 0x222222, 0x000000]} /> */}
        {/* <gridHelper args={[40, 40, 0x222255, 0xbbbbbb]} /> */}
        {/* <gridHelper args={[40, 40, 0x999999, 0xbbbbbb]} /> */}
      </Suspense>
    </Canvas>
  );

}

export default App;
