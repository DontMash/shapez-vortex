import type { Action } from 'svelte/action';
import { PerspectiveCamera, type Mesh, Group, Camera, WebGLRenderer, ColorManagement, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { SHAPE_COLOR_BASE_MATERIAL, SHAPE_COLOR_MATERIALS, SHAPE_LAYER_HEIGHT, SHAPE_LAYER_SCALE_FACTOR, SHAPE_MAX_LAYERS, SHAPE_MAX_QUARTERS, SHAPE_QUARTER_EXPAND_OFFSET, type Shape, type ShapeLayerData, type ShapeQuarterData, type ShapeType } from '$lib/shape.types';

import BASE_SHAPE from '$lib/assets/models/shapes/base.gltf';
import CIRCLE_SHAPE from '$lib/assets/models/shapes/circle-quarter.gltf';
import RECT_SHAPE from '$lib/assets/models/shapes/rect-quarter.gltf';
import WIND_SHAPE from '$lib/assets/models/shapes/wind-quarter.gltf';
import STAR_SHAPE from '$lib/assets/models/shapes/star-quarter.gltf';
import PIN_SHAPE from '$lib/assets/models/shapes/pin-quarter.gltf';
import CRYSTAL_SHAPE from '$lib/assets/models/shapes/crystal-quarter.gltf';

export const view: Action<HTMLCanvasElement, { data: Shape, isExtended: boolean, isExpanded: boolean; }, { 'on:load': (e: CustomEvent<string>) => void; }> = (canvas, params) => {
    if (!params) {
        throw new Error('[SHAPE-VIEW] No params provided');
    }
    const SHAPES: Record<ShapeType, string> = {
        C: CIRCLE_SHAPE,
        R: RECT_SHAPE,
        W: WIND_SHAPE,
        S: STAR_SHAPE,
        P: PIN_SHAPE,
        c: CRYSTAL_SHAPE
    };
    const { data } = params;

    const renderer = createRenderer(canvas);
    const camera = createCamera(canvas.width, canvas.height);
    const controls = createControls(camera, canvas);
    const scene = new Scene();
    const loader = new GLTFLoader();
    const base = createBase();
    scene.add(base);

    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(canvas.parentElement ?? document.body);
    onResize();

    let isExtended = false;
    let isExpanded = false;

    assign(data);
    params.isExtended ? extend() : contract();
    params.isExpanded ? expand() : collapse();
    update();

    function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
        const renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas
        });
        ColorManagement.enabled = true;
        return renderer;
    }
    function createCamera(width: number, height: number): PerspectiveCamera {
        const camera = new PerspectiveCamera(55, width / height, 0.1, 10);
        camera.position.y = 2;
        camera.position.z = 1.5;
        camera.lookAt(0, 0, 0);
        return camera;
    }
    function createControls(camera: Camera, element: HTMLElement): OrbitControls {
        const controls = new OrbitControls(camera, element);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI * 0.4;
        return controls;
    }
    function createBase(): Group {
        getBaseModel().then((base) => {
            base.material = SHAPE_COLOR_BASE_MATERIAL;
            scene.add(base);
        }).catch(() => { throw new Error('Base model not found'); });

        const base = new Group();
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
        return base;
    }

    function onResize() {
        const width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
        const height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
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

    function update() {
        requestAnimationFrame(() => update());

        controls.update();
        renderer.render(scene, camera);
    }
    function reset() {
        controls.enableDamping = false;
        controls.update();
        controls.reset();
        controls.enableDamping = true;
    }
    async function assign(shapeData: Shape) {
        clear();
        return new Promise<void>((resolve, reject) => {
            const layerPromises = shapeData.layers.map<Promise<void>>(
                (data, index) => assignLayer(data, index)
            );
            Promise.all(layerPromises).then(() => {
                canvas.dispatchEvent(new CustomEvent('load'));
                return resolve();
            }).catch(reject);
        });
    }
    function clear() {
        base.children
            .forEach(layer => layer.children
                .forEach(quarter => quarter.children = []));
    }
    function assignLayer(data: ShapeLayerData, index: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (index < 0 || index > 3)
                return reject(new Error(`Invalid layerIndex ${index}`));

            const quarterPromises = data.quarters.map<Promise<void>>(
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
            }).catch(() => reject(new Error('Shape model not found')));
        });
    }
    function extend() {
        if (isExtended) return;
        isExtended = true;

        base.children.forEach((layer, layerIndex) => {
            layer.position.y += (layerIndex + 1) * SHAPE_LAYER_HEIGHT;
        });
    }
    function contract() {
        if (!isExtended) return;
        isExtended = false;

        base.children.forEach((layer, layerIndex) => {
            layer.position.y -= (layerIndex + 1) * SHAPE_LAYER_HEIGHT;
        });
    }
    function expand() {
        if (isExpanded) return;
        isExpanded = true;

        base.children.forEach((layer, layerIndex) => {
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

        base.children.forEach((layer, layerIndex) => {
            layer.children.forEach(quarter => {
                const offset = SHAPE_QUARTER_EXPAND_OFFSET
                    .clone()
                    .applyQuaternion(quarter.quaternion)
                    .multiplyScalar((layerIndex + 1) * SHAPE_LAYER_SCALE_FACTOR);
                quarter.position.sub(offset);
            });
        });
    }

    return {
        update(params) {
            params.isExtended ? extend() : contract();
            params.isExpanded ? expand() : collapse();
            assign(params.data);
        },
        destroy() {
            resizeObserver.disconnect();
        }
    };
};
