varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 transformed = vec3(position);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
