// main.js: shader de noise líquido com GLSL + Three.js
// Rodar: npm install && npm run dev
import * as THREE from 'three';

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv; // passa o UV para o fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // número pseudo-aleatório a partir de uma posição
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  // noise: interpola o hash dos 4 cantos da célula
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 p = vUv * 3.0;                      // frequência do noise
    float n = noise(p + uTime * 0.2);        // velocidade do tempo
    n = noise(p + n * 2.0 - uTime * 0.15);   // noise dentro de noise

    vec3 cor1 = vec3(0.05, 0.0, 0.3);
    vec3 cor2 = vec3(0.0, 0.9, 1.0);
    vec3 cor3 = vec3(0.65, 0.55, 1.0);
    vec3 color = mix(cor1, cor2, n);
    color = mix(color, cor3, smoothstep(0.5, 1.0, n));

    float d = distance(vUv, uMouse);
    color += smoothstep(0.4, 0.0, d) * vec3(0.3, 0.1, 0.8); // intensidade do mouse

    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  },
});

// plano que cobre a tela inteira
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

window.addEventListener('mousemove', (e) => {
  material.uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight // no GLSL o Y cresce para cima
  );
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
