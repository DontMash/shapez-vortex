import {
    AmbientLight,
    Color,
    CylinderGeometry,
    DirectionalLight,
    Group,
    Material,
    Mesh,
    MeshStandardMaterial,
    MeshToonMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

import CIRCLE_QUARTER from '$lib/assets/models/gltf/shapes/circle-quarter.gltf?raw';
import RECT_QUARTER from '$lib/assets/models/gltf/shapes/rect-quarter.gltf?raw';
import WIND_QUARTER from '$lib/assets/models/gltf/shapes/wind-quarter.gltf?raw';
import STAR_QUARTER from '$lib/assets/models/gltf/shapes/star-quarter.gltf?raw';
import PIN_QUARTER from '$lib/assets/models/gltf/shapes/pin-quarter.gltf?raw';

type ShapeIdentifier = string;
type ShapeType = 'C' | 'R' | 'W' | 'S' | 'P';
type ShapeTypeIdentifier = ShapeType | '-';
type ShapeColor = 'r' | 'g' | 'b' | 'y' | 'p' | 'c' | 'w';
type ShapeColorIdentifier = ShapeColor | 'u' | '-';
type ShapeQuarter = Mesh;

const SHAPE: ShapeIdentifier = 'CwCwCwRw:P-P-P-P-:P-P-P-P-:CcCcCcCc';

const SHAPE_BASE_OFFSET = 0.05;
const SHAPE_MAX_LAYERS = 4;
const SHAPE_LAYER_HEIGHT = 0.1;
const SHAPE_LAYER_SEPERATOR = ':';
const SHAPE_QUARTER_REGEX = /(..?)/g;
const SHAPE_QUARTER_PARAMETERS_REGEX = /(.?)/g;
const SHAPE_TYPE_REGEX = /^[CRWSP-]$/;
export const SHAPE_IDENTIFIER_REGEX = /^([CRWSP-][rgbypcwu-]){4}(:([CRWSP-][rgbypcwu-]){4}){0,4}$/;

const SHAPE_COLOR_BASE = 0x555555;
const SHAPE_COLOR_NONE = 0x777777;
const SHAPE_COLOR_PIN = 0x444450;
const SHAPE_COLOR_RED = 0xee3333;
const SHAPE_COLOR_GREEN = 0x00ee00;
const SHAPE_COLOR_BLUE = 0x0000ee;
const SHAPE_COLOR_YELLOW = 0xeeee00;
const SHAPE_COLOR_PURPLE = 0xcc00cc;
const SHAPE_COLOR_CYAN = 0x00eeee;
const SHAPE_COLOR_WHITE = 0xfafafa;
const SHAPE_COLOR_OUTLINE = 0x000000;

const SHAPE_COLOR_BASE_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_BASE });
const SHAPE_COLOR_NONE_MATERIAL = new MeshStandardMaterial({ color: SHAPE_COLOR_NONE, vertexColors: true });
const SHAPE_COLOR_PIN_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_PIN, vertexColors: true });
const SHAPE_COLOR_RED_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_RED, vertexColors: true });
const SHAPE_COLOR_GREEN_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_GREEN, vertexColors: true });
const SHAPE_COLOR_BLUE_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_BLUE, vertexColors: true });
const SHAPE_COLOR_YELLOW_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_YELLOW, vertexColors: true });
const SHAPE_COLOR_PURPLE_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_PURPLE, vertexColors: true });
const SHAPE_COLOR_CYAN_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_CYAN, vertexColors: true });
const SHAPE_COLOR_WHITE_MATERIAL = new MeshToonMaterial({ color: SHAPE_COLOR_WHITE, vertexColors: true });

const SHAPE_COLOR_MATERIALS: Record<ShapeColorIdentifier, Material> = {
    r: SHAPE_COLOR_RED_MATERIAL,
    g: SHAPE_COLOR_GREEN_MATERIAL,
    b: SHAPE_COLOR_BLUE_MATERIAL,
    y: SHAPE_COLOR_YELLOW_MATERIAL,
    p: SHAPE_COLOR_PURPLE_MATERIAL,
    c: SHAPE_COLOR_CYAN_MATERIAL,
    w: SHAPE_COLOR_WHITE_MATERIAL,
    u: SHAPE_COLOR_NONE_MATERIAL,
    '-': SHAPE_COLOR_PIN_MATERIAL
};

export class ShapeVisualizer {
    private renderer: WebGLRenderer | undefined;
    private camera: PerspectiveCamera | undefined;
    private controls: OrbitControls | undefined;
    private composer: EffectComposer | undefined;
    private scene: Scene;
    private base: Object3D | undefined;
    private quarters: Record<ShapeType, ShapeQuarter> | undefined;

    constructor(private canvas: HTMLCanvasElement) {
        if (!WebGL.isWebGLAvailable()) {
            throw getError('create', 'WebGL is not supported');
        }

        this.scene = new Scene();
        const lights = this.createLights();
        this.scene.add(lights);
        this.base = this.createBase();
        this.scene.add(this.base);

        this.renderer = this.createRenderer();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.composer = this.createComposer(this.width, this.height, this.renderer, this.camera, this.scene, this.base);

        this.update();
    }

    get width(): number {
        return this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    }

    get height(): number {
        return this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    }

    draw(identifier: ShapeIdentifier = SHAPE): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!identifier.match(SHAPE_IDENTIFIER_REGEX)) {
                return reject(getError('draw', 'Invalid shape identifier'));
            }
            this.getModels()
                .then(models => {
                    this.quarters = this.getQuarters(models);
                })
                .catch(reject)
                .finally(() => {
                    this.clear();

                    const layerIdentifiers = identifier.split(SHAPE_LAYER_SEPERATOR);
                    let currentLayerIndex = 0;
                    layerIdentifiers.forEach((layerIdentifier) => {
                        const quarters = layerIdentifier.match(SHAPE_QUARTER_REGEX);
                        if (!quarters) return;

                        const shapeLayer = this.getLayer(currentLayerIndex++);
                        quarters.forEach((quarter, quarterIndex) => {
                            const quarterShapeParameters = quarter.match(SHAPE_QUARTER_PARAMETERS_REGEX);
                            if (!quarterShapeParameters) return;

                            const quarterShapeType = quarterShapeParameters[0] as ShapeTypeIdentifier;
                            const quarterShapeColor = quarterShapeParameters[1] as ShapeColorIdentifier;
                            if (quarterShapeType === '-') return;

                            const shapeQuarter = this.getQuarter(quarterShapeType).clone();
                            shapeQuarter.rotateY(Math.PI * -0.5 * quarterIndex);
                            const material = SHAPE_COLOR_MATERIALS[quarterShapeColor];
                            shapeQuarter.material = material;

                            shapeLayer.add(shapeQuarter);
                        });
                    });

                    return resolve();
                });
        });
    }

    clear() {
        if (!this.base) {
            throw getError('clear', 'Base not available');
        }
        this.base.children.forEach(layer => layer.children = []);
    }

    private createRenderer(canvas = this.canvas, width = this.width, height = this.height): WebGLRenderer {
        const renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        return renderer;
    }

    private createCamera(width = this.width, height = this.height): PerspectiveCamera {
        const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.y = 2;
        camera.position.z = 1.5;
        return camera;
    }

    private createControls(camera = this.camera, renderer = this.renderer): OrbitControls {
        if (!camera) {
            throw getError('createControls', 'Camera not provided');
        }
        if (!renderer) {
            throw getError('createControls', 'Renderer not provided');
        }

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1.5;
        controls.maxDistance = 3;
        controls.maxPolarAngle = Math.PI * 0.4;
        return controls;
    }

    private createLights(): Object3D {
        const lights = new Group();
        const ambientLight = new AmbientLight(0xffffff, 0.1);
        lights.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(1, 3, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        lights.add(directionalLight);
        return lights;
    }

    private createBase(): Object3D {
        const geometry = new CylinderGeometry(0.75, 0.75, 0.1, 32);
        const base = new Mesh(geometry, SHAPE_COLOR_BASE_MATERIAL);
        base.position.y = -SHAPE_BASE_OFFSET;
        base.rotateY(Math.PI * 0.5);
        base.receiveShadow = true;
        for (let i = 0; i < SHAPE_MAX_LAYERS; i++) {
            const layer = new Group();
            layer.position.y = i * SHAPE_LAYER_HEIGHT + SHAPE_BASE_OFFSET;
            layer.scale.x = 1 - i * 0.2;
            layer.scale.z = 1 - i * 0.2;
            base.add(layer);
        }
        return base;
    }

    private createComposer(width = this.width, height = this.height, renderer = this.renderer, camera = this.camera, scene = this.scene, ...objects: Array<Object3D>): EffectComposer {
        if (!camera) {
            throw getError('createComposer', 'Camera not provided');
        }
        if (!renderer) {
            throw getError('createComposer', 'Renderer not provided');
        }

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const outlinePass = new OutlinePass(
            new Vector2(width, height),
            scene,
            camera
        );
        outlinePass.visibleEdgeColor = new Color(SHAPE_COLOR_OUTLINE);
        outlinePass.edgeStrength = width / 500;
        outlinePass.edgeThickness = 1;
        outlinePass.selectedObjects = [...objects];
        composer.addPass(outlinePass);

        const gammaPass = new ShaderPass(GammaCorrectionShader);
        composer.addPass(gammaPass);
        return composer;
    }

    private getModels(): Promise<Array<Mesh>> {
        return new Promise<Array<Mesh>>((resolve, reject) => {
            const loader = new GLTFLoader();
            Promise.all([
                loader.parseAsync(CIRCLE_QUARTER, ''),
                loader.parseAsync(RECT_QUARTER, ''),
                loader.parseAsync(WIND_QUARTER, ''),
                loader.parseAsync(STAR_QUARTER, ''),
                loader.parseAsync(PIN_QUARTER, '')
            ])
                .then(values => resolve(values.map((value) => {
                    console.log(value);
                    return value.scene.children[0] as Mesh;
                })))
                .catch(reason => reject(getError('getModels', reason.toString())));
        });
    }

    private getQuarters(models: Array<ShapeQuarter>): Record<ShapeType, ShapeQuarter> {
        const quarters: Record<ShapeType, ShapeQuarter> = {
            C: models[0],
            R: models[1],
            W: models[2],
            S: models[3],
            P: models[4]
        };
        return quarters;
    }

    private update() {
        requestAnimationFrame(() => this.update());

        this.controls?.update();
        this.composer?.render();
    }

    private getLayer(index: number): Object3D {
        if (!this.base) {
            throw getError('getLayer', 'Base not available');
        }
        return this.base.children[index];
    }

    private getQuarter(type: ShapeType): ShapeQuarter {
        if (!this.quarters) {
            throw getError('getQuarter', 'Quarters not available');
        }
        if (!type.match(SHAPE_TYPE_REGEX)) {
            throw getError('getQuarter', `Invalid shape type: ${type}`);
        }
        return this.quarters[type];
    }
}

const getError = (meta: string, message: string) => new Error(message, { cause: `[SHAPE-VISUALIZER] ${meta} - ${message}` });
