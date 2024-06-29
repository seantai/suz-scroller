import { Bvh } from '@react-three/drei'
import { Canvas, addEffect } from '@react-three/fiber'
import Lenis from '@studio-freight/lenis'
import { useRef } from 'react'
import { Border } from './components/Border'
import { InstancedMeshes } from './components/InstancedMeshes'
import { Kamera } from './components/Kamera'
import { Overlay } from './components/Overlay'
// import { Perf } from 'r3f-perf'

const Scene = () => {
  const lenis = new Lenis({ syncTouch: true, infinite: true })
  addEffect((t) => lenis.raf(t))

  return (
    <>
      <InstancedMeshes {...{ lenis }} />

      <Kamera />

      <Border />
    </>
  )
}

export default function App() {
  const parent = useRef()

  return (
    <>
      <div className="fixed w-full h-full mx-auto inset-0 overflow-hidden flex flex-col bg-[#3680F7]" ref={parent}>
        <div className="m-2 md:m-10 h-full relative">
          <Overlay />
          <Canvas
            className="rounded-l-xl rounded-r-2xl overflow-y-auto"
            shadows
            eventSource={parent.current}
            camera={{ position: [0, 0, 20], fov: 35, near: 0.001, far: 1000 }}>
            <Bvh firstHitOnly>
              <Scene />
              {/* <Perf /> */}
            </Bvh>
          </Canvas>
        </div>
      </div>
      <div className="h-[700vh]" />
    </>
  )
}
