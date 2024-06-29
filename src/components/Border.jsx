import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'

export const Border = () => {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0
      },
      u_progress: {
        value: 0
      }
    }),
    []
  )
  const shaderRef = useRef()

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.elapsedTime
    }
  })
  return (
    <Billboard>
      <mesh scale={[viewport.width * 1.1, viewport.height * 1.1, 1]} position={[0, 0, -8]}>
        <planeGeometry args={[1, 1, 100, 100]} />
        <shaderMaterial
          ref={shaderRef}
          uniforms={uniforms}
          transparent
          vertexShader={`

            varying vec2 v_uv;
            uniform float u_time;
            
            void main() {
              v_uv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }

        `}
          fragmentShader={`    

            varying vec2 v_uv;
            uniform float u_time;
            uniform float u_progress;
            
            vec3 hsv2rgb(vec3 c) {
              vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
              vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
              return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
            
              vec3 hsv = vec3(u_time * .01 / .2, .62, 1.0);
              vec4 final = vec4(hsv2rgb(hsv), 1.0);
              
              float borderWidth = 0.05; // Distance from edge where fading starts
              float fadeWidth = 0.1; // Width of the fade
              
              float left = smoothstep(borderWidth, borderWidth + fadeWidth, v_uv.x);
              float right = smoothstep(borderWidth, borderWidth + fadeWidth, 1.0 - v_uv.x);
              float top = smoothstep(borderWidth, borderWidth + fadeWidth, v_uv.y);
              float bottom = smoothstep(borderWidth, borderWidth + fadeWidth, 1.0 - v_uv.y);
              
              float frameAlpha = (1.0 - left) + (1.0 - right) + (1.0 - top) + (1.0 - bottom);
              frameAlpha = clamp(frameAlpha, 0.0, 1.0);
              
              final.a *= frameAlpha;
              
              gl_FragColor = final;
              
              #include <colorspace_fragment>
              #include <tonemapping_fragment>
            }
        `}
        />
      </mesh>
    </Billboard>
  )
}
