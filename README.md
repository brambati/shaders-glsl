# Shaders GLSL: Liquid Noise

Código do vídeo **"Shaders GLSL"** do canal da [Digital Lift](https://digitallift.com.br).

Seus primeiros shaders do zero com GLSL e Three.js: um vertex shader, um fragment shader e um efeito líquido de noise que reage ao tempo e ao mouse.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente `http://localhost:5173`) e mova o mouse.

## Conceitos

| Conceito | Papel |
|---|---|
| Vertex shader | roda uma vez por vértice e define `gl_Position` |
| Fragment shader | roda uma vez por pixel e define `gl_FragColor` |
| `uniform` | valor enviado do JavaScript, igual para todos os pixels (`uTime`, `uMouse`) |
| `varying` | valor passado do vertex para o fragment shader (`vUv`) |
| `mix(a, b, t)` | interpola entre `a` e `b` |
| `smoothstep(a, b, x)` | interpolação suave, em curva S |
| `distance(a, b)` | distância entre dois pontos |
| `noise(p)` | valor pseudo-aleatório suave, feito com `hash` e `mix` |

## Para ajustar

No `main()` do fragment shader:

- `vUv * 3.0`: frequência do noise
- `uTime * 0.2` e `uTime * 0.15`: velocidade
- `vec3(0.3, 0.1, 0.8)`: cor e intensidade do brilho em volta do mouse
- `cor1`, `cor2`, `cor3`: paleta

## Para continuar

- [The Book of Shaders](https://thebookofshaders.com)
- [Shadertoy](https://www.shadertoy.com)

## Arquivos

- `index.html`: o canvas e o título sobreposto
- `style.css`: canvas em tela cheia
- `main.js`: os dois shaders e o setup do Three.js
