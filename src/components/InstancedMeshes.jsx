import { useGLTF, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Matrix4, MeshMatcapMaterial, Vector3 } from 'three'
import { Quaternion, RepeatWrapping } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'
import frag from '../glsl/foo.frag'
import vert from '../glsl/foo.vert'

extend({ InstancedUniformsMesh })

export const InstancedMeshes = ({ lenis }) => {
  const ref = useRef()

  const count = 100
  const Suz = useGLTF('./Suz_Quad.glb')

  const dummyVector3 = new Vector3()
  const currentInstanceMatrix = new Matrix4()
  const quaternion = new Quaternion()

  useFrame(() => {
    if (ref.current) {
      const loopProgress = ((lenis.progress % 1) + 1) % 1

      for (let i = 0; i < count; i++) {
        const normalizedIndex = i / (count - 1)

        const angle = normalizedIndex * Math.PI * 4 + loopProgress * Math.PI * 2
        const radius = 5 * Math.sin(loopProgress * Math.PI)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = 10 * Math.sin(loopProgress * Math.PI * 2 + normalizedIndex * Math.PI * 2)

        dummyVector3.set(x, y, z)

        quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle)

        currentInstanceMatrix.compose(dummyVector3, quaternion, new Vector3(1, 1, 1))

        ref.current.setMatrixAt(i, currentInstanceMatrix)
      }
      ref.current.instanceMatrix.needsUpdate = true
    }
  })

  const alphaTexture = useTexture('alphaMap.jpg', (t) => {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(0.2, 0.2)
  })

  const fireTexture = useTexture('GKaztSpbwAI1sjx.jpeg')
  const material = new CustomShaderMaterial({
    baseMaterial: MeshMatcapMaterial,
    vertexShader: vert,
    fragmentShader: frag,
    silent: true,
    uniforms: {
      u_time: {
        value: 0
      },
      u_position: {
        value: new Vector3()
      }
    },
    defines: {
      USE_INSTANCING_PLZ: 1
    },
    alphaMap: alphaTexture,
    matcap: fireTexture,

    transparent: true
  })

  return <instancedUniformsMesh ref={ref} args={[Suz.nodes.Suz_Quad.geometry, material, count]} scale={0.7} />
}
