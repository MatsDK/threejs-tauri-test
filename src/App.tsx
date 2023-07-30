import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Mesh } from "three";
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
    joint2.current = gltf.scene.getObjectByName("Bone2")
  }, [gltf])

  useFrame((state, delta) => {
    if (joint1.current) {
      // ref.current.rotation.y += 0.003
      joint1.current.rotation.y += 0.001
    }
    if (joint2.current) {
      joint2.current.rotation.x += 0.0004
    }
  });
  return (
    <>
      <primitive
        object={gltf.scene}
        position={position}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
      />
    </>
  );
};

function App() {

  async function greet() {
    await taurpc._hello_world_()
  }

  useEffect(() => {
    const unlisten = taurpc._hello_world_.on(() => {
      console.log("hello world event triggered")
    })

    return () => unlisten()
  }, [])

  return (
    <Canvas style={{
      width: "100vw",
      height: "100vh",
    }}
      camera={{ fov: 45, position: [0, 5, 10] }}
    >
      <pointLight position={[0, 0, -10]} intensity={100} color="#aae" />
      <pointLight position={[10, 10, 0]} intensity={100} color="#aae" />
      <pointLight position={[-10, 10, 0]} intensity={100} color="#aae" />
      <spotLight position={[0, 0, 3]} intensity={10} color="#aae" />
      <OrbitControls target={[0, 0, 0]} />
      <Stats />
      <Suspense fallback={null}>
        <GltfModel />
        <gridHelper args={[40, 40, 0x222255, 'black']} />
      </Suspense>
    </Canvas>
  );

}

export default App;
