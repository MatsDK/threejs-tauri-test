import { TransformControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { appLocalDataDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { TransformControls as TransformControlsImpl } from 'three-stdlib'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadRobotModel } from '../../lib/model/load'
import { Model } from '../../lib/store'
import { transformModalAtom } from '../TransformModal'
import { orbitControlsRefAtom } from './'
import { TransformObject } from './TransformObject'

const appLocalDataDirPath = await appLocalDataDir()

export const GltfModel = (
  { model }: { model: Model },
) => {
  const modelPath = convertFileSrc(
    appLocalDataDirPath + `models\\${model.config.model_path}`,
  )
  const orbitControls = useAtomValue(orbitControlsRefAtom)
  const [transformModalState, setTransformModalState] = useAtom(
    transformModalAtom,
  )

  const gltf: { scene: THREE.Group } = useLoader(GLTFLoader, modelPath)

  const [transform, setTransform] = useState<TransformControlsImpl | null>(null)
  const transformRef = useCallback((node: TransformControlsImpl) => {
    setTransform(node)
  }, [])

  useEffect(() => {
    if (transform) {
      // TODO: remove event listener
      transform.addEventListener('objectChange', (e) => {
        const object = e.target.object as THREE.Object3D

        setTransformModalState((prev) => ({
          ...prev,
          position: object.position,
          rotation: object.rotation,
        }))
      })
      const callback: THREE.EventListener<
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
      transform.addEventListener('dragging-changed', callback)
      return () => transform.removeEventListener('dragging-changed', callback)
    }
  }, [orbitControls, transform])

  useEffect(() => {
    const armature = gltf.scene
    // const armature = gltf.scene.getObjectByName('Armature')
    if (!armature) return

    loadRobotModel(model, armature)
  }, [gltf])

  return (
    <>
      <TransformObject object={gltf.scene} />
      <primitive
        object={gltf.scene}
        // onPointerOver={(event) => hover(true)}
        // onPointerOut={(event) => hover(false)}
      />
    </>
  )
}
