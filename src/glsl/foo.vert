

varying vec2 v_uv;
uniform float u_time;
uniform mat4 u_newInstanceMatrix;
uniform vec3 u_position;
varying vec3 v_instancePosition;
varying float v_oscillation;

float easeInOutQuadratic(float t) {
  return t < 0.5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

void main() {
  v_uv = uv;

  vec3 newPosition = position;

#if USE_INSTANCING_PLZ == 1

  float toCenter = length(instanceMatrix[3].zz);

  float oscillation = sin(u_time * 3.0 + toCenter) * 0.5 + 0.5;
  oscillation = easeInOutQuadratic(oscillation);
  v_oscillation = oscillation;

  newPosition.z += oscillation * 5.3;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * instanceMatrix *
                    vec4(newPosition, 1.0);
#else
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
#endif
}