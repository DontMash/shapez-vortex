precision mediump float;

varying vec4 vPosition;
varying vec2 vUv;

void main() {
    vPosition = modelMatrix * vec4(position, 1.0);
    vUv = uv;
}
