precision mediump float;

uniform sampler2D lutTexture;
uniform vec3 accentColor;
uniform vec3 emissive1Color;
uniform vec3 emissive2Color;

varying vec4 vPosition;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(lutTexture, vec2(vUv.x, 1.0 - vUv.y));
    vec4 layerColor = vec4(vec3(vPosition.y * 0.3 + 0.15), 1.0);
    int xIndex = int(vUv.x * 16.0);
    int yIndex = int(vUv.y * 16.0);
    // Accent (orange)
    if (xIndex == 1) {
        color = vec4(accentColor, 1.0);
    }
    // Emissive
    if (xIndex == 2) {
        if (yIndex == 1) {
            color = vec4(emissive1Color,1.0);
        }
        if (yIndex == 2) {
            color = vec4(emissive2Color,1.0);
        }
        // csm_Emissive = color.xyz;
    }
    // Metal brushed
    if (xIndex == 3) {
        csm_Roughness = 0.5;
        csm_Metalness = 0.5;
    }
    // Metal noise
    if (xIndex == 4) {
        csm_Roughness = 0.5;
        csm_Metalness = 0.5;
    }
    // Metal coated
    if (xIndex == 5) {
        csm_Roughness = 0.7;
        csm_Metalness = 0.9;
    }
    // Plastic
    if (xIndex == 6) {
        if (yIndex ==1) {
            color = layerColor;
        }

        csm_Roughness = 0.3;
        csm_Metalness = 0.2;
    }
    // Belt Rubber
    if (xIndex == 7) {
        color = layerColor;
    }

    csm_DiffuseColor = color;
}
