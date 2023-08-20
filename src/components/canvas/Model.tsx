import { loadRobotModel } from '@lib/model/load'
import { Model, selectedModelAtom } from '@lib/store'
import { useLoader } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import { appLocalDataDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TransformObject } from './TransformObject'

const appLocalDataDirPath = await appLocalDataDir()

export const GltfModel = (
  { model }: { model: Model },
) => {
  const [selectedModel] = useAtom(selectedModelAtom)
  const modelPath = convertFileSrc(
    appLocalDataDirPath + `models\\${model.config.model_path}`,
  )

  const gltf: { scene: THREE.Group } = useLoader(GLTFLoader, modelPath)
  useEffect(() => {
    const armature = gltf.scene
    // const armature = gltf.scene.getObjectByName('Armature')
    if (!armature) return

    loadRobotModel(model, armature)
  }, [gltf])

  return (
    <>
      <TransformObject object={gltf.scene} />
      <Select enabled={selectedModel?.id === model.id}>
        <primitive
          object={gltf.scene}
          // onPointerOver={(event) => hover(true)}
          // onPointerOut={(event) => hover(false)}
        />
      </Select>
    </>
  )
}
