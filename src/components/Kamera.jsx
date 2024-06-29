import { CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'

export const Kamera = () => {
  const camRef = useRef()

  const targetPosition = new Vector3()
  const radius = 10
  useFrame(({ clock }) => {
    if (camRef.current) {
      const angle = clock.getElapsedTime() * 0.05
      targetPosition.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius)
      camRef.current.setLookAt(targetPosition.x, targetPosition.y, targetPosition.z, 0, 0, 0, true)
    }
  })

  return <CameraControls ref={camRef} makeDefault mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }} touches={{ one: 0, two: 0, three: 0 }} />
}
