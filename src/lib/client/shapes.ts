import {
    SHAPE_COLOR_BASE_MATERIAL,
    type ShapeType,
    SHAPE_MAX_LAYERS,
    SHAPE_LAYER_HEIGHT,
    SHAPE_LAYER_SCALE_FACTOR,
    SHAPE_MAX_QUARTERS,
    type ShapeLayerData,
    type ShapeQuarterData,
    SHAPE_COLOR_MATERIALS,
    SHAPE_QUARTER_EXPAND_OFFSET,
    type Shape
} from '$lib/shape.types';
import {
    Scene,
    Camera,
    WebGLRenderer,
    ColorManagement,
    Group,
    Mesh
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import BASE_SHAPE from '$lib/assets/models/shapes/base.gltf';
import CIRCLE_SHAPE from '$lib/assets/models/shapes/circle-quarter.gltf';
import RECT_SHAPE from '$lib/assets/models/shapes/rect-quarter.gltf';
import WIND_SHAPE from '$lib/assets/models/shapes/wind-quarter.gltf';
import STAR_SHAPE from '$lib/assets/models/shapes/star-quarter.gltf';
import PIN_SHAPE from '$lib/assets/models/shapes/pin-quarter.gltf';
import CRYSTAL_SHAPE from '$lib/assets/models/shapes/crystal-quarter.gltf';
const SHAPES: Record<ShapeType, string> = {
    C: CIRCLE_SHAPE,
    R: RECT_SHAPE,
    W: WIND_SHAPE,
    S: STAR_SHAPE,
    P: PIN_SHAPE,
    c: CRYSTAL_SHAPE
};

export type ShapeRenderer = {
    resize: (width: number, height: number, pixelRation?: number) => void;
    render: (scene: Scene, camera: Camera) => void;
    dispose: () => void;
};
export function createShapeRenderer(canvas: HTMLCanvasElement): ShapeRenderer {
    const renderer = createRenderer(canvas);

    function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
        const renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas,
            preserveDrawingBuffer: true,
        });
        ColorManagement.enabled = true;
        return renderer;
    }
    function resize(width: number, height: number, pixelRatio: number = window.devicePixelRatio) {
        renderer.setSize(width, height);
        renderer.setPixelRatio(pixelRatio);
    }
    function render(scene: Scene, camera: Camera) {
        renderer.render(scene, camera);
    }
    function dispose() {
        renderer.dispose();
    }

    return { render, resize, dispose };
}

export type ShapeModel = {
    scene: Scene;
    assign: (data: Shape) => Promise<void>;
    extend: () => void;
    contract: () => void;
    expand: () => void;
    collapse: () => void;
};
export function createShapeModel(): ShapeModel {
    const scene = new Scene();
    const loader = new GLTFLoader();
    const base = createBase();
    scene.add(base);

    let isExtended = false;
    let isExpanded = false;

    function createBase(): Group {
        getBaseModel().then((baseModel) => {
            baseModel.material = SHAPE_COLOR_BASE_MATERIAL;
            scene.add(baseModel);
        }).catch(() => { throw new Error('Base model not found'); });

        const base = new Group();
        return base;
    }
    function getBaseModel(): Promise<Mesh> {
        return new Promise<Mesh>((resolve, reject) => {
            loader.loadAsync(BASE_SHAPE)
                .then(value => {
                    return resolve(value.scene.children[0] as Mesh);
                })
                .catch(reject);
        });
    }
    function getShapeModel(type: ShapeType): Promise<Mesh> {
        return new Promise<Mesh>((resolve, reject) => {
            loader.loadAsync(SHAPES[type])
                .then(value => {
                    return resolve(value.scene.children[0] as Mesh);
                })
                .catch(reject);
        });
    }

    async function assign(data: Shape): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            reset();
            const layerPromises = data.map<Promise<void>>(
                (data, index) => assignLayer(data, index)
            );
            Promise.all(layerPromises).then(() => resolve())
                .catch(reject);
        });
    }
    function reset() {
        base.remove(...base.children);

        for (let i = 0; i < SHAPE_MAX_LAYERS; i++) {
            const layer = new Group();
            layer.position.y = i * SHAPE_LAYER_HEIGHT;
            layer.scale.x = 1 - i * SHAPE_LAYER_SCALE_FACTOR;
            layer.scale.z = 1 - i * SHAPE_LAYER_SCALE_FACTOR;
            for (let k = 0; k < SHAPE_MAX_QUARTERS; k++) {
                const quarter = new Group();
                quarter.rotateY(Math.PI * -0.5 * k);
                layer.add(quarter);
            }
            base.add(layer);
        }
    }
    function assignLayer(data: ShapeLayerData, index: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (index < 0 || index > 3)
                return reject(new Error(`Invalid layerIndex ${index}`));

            const quarterPromises = data.map<Promise<void>>(
                (quarterData, quarterIndex) => assignQuarter(index, quarterData, quarterIndex)
            );
            Promise.all(quarterPromises).then(() => resolve()).catch(reject);
        });
    }
    function assignQuarter(layerIndex: number, data: ShapeQuarterData, index: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (data.type === '-') return resolve();

            getShapeModel(data.type).then((shapeQuarter) => {
                const material = SHAPE_COLOR_MATERIALS[data.color];
                shapeQuarter.material = material;

                if (index < 0 || index > 3)
                    return reject(new Error(`Invalid quarterIndex ${index}`));

                const layer = base.children[layerIndex];
                const quarter = layer.children[index];
                quarter.add(shapeQuarter);
                return resolve();
            }).catch(() => reject(new Error(`Shape model not found - ${data.type}`)));
        });
    }
    function extend() {
        if (isExtended) return;
        isExtended = true;

        const layers = base.children[0];
        layers.children.forEach((layer, layerIndex) => {
            layer.position.y += (layerIndex + 1) * SHAPE_LAYER_HEIGHT;
        });
    }
    function contract() {
        if (!isExtended) return;
        isExtended = false;

        const layers = base.children[0];
        layers.children.forEach((layer, layerIndex) => {
            layer.position.y -= (layerIndex + 1) * SHAPE_LAYER_HEIGHT;
        });
    }
    function expand() {
        if (isExpanded) return;
        isExpanded = true;

        const layers = base.children[0];
        layers.children.forEach((layer, layerIndex) => {
            layer.children.forEach(quarter => {
                const offset = SHAPE_QUARTER_EXPAND_OFFSET
                    .clone()
                    .applyQuaternion(quarter.quaternion)
                    .multiplyScalar((layerIndex + 1) * SHAPE_LAYER_SCALE_FACTOR);
                quarter.position.add(offset);
            });
        });
    }
    function collapse() {
        if (!isExpanded) return;
        isExpanded = false;

        const layers = base.children[0];
        layers.children.forEach((layer, layerIndex) => {
            layer.children.forEach(quarter => {
                const offset = SHAPE_QUARTER_EXPAND_OFFSET
                    .clone()
                    .applyQuaternion(quarter.quaternion)
                    .multiplyScalar((layerIndex + 1) * SHAPE_LAYER_SCALE_FACTOR);
                quarter.position.sub(offset);
            });
        });
    }

    return { scene, assign, extend, contract, expand, collapse };
}
