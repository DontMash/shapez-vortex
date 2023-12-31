import type { Action } from 'svelte/action';
import {
    AmbientLight,
    Camera,
    ColorManagement,
    DirectionalLight,
    GridHelper,
    Group,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GRID_SIZE, type BuildingIdentifier, GRID_COLOR } from '$lib/building.types';
import type { Blueprint } from '$lib/blueprint.types';

import BELT_FORWARD_DATA from '$lib/assets/models/buildings/BeltDefaultForwardInternalVariant.gltf';
import BELT_LEFT_DATA from '$lib/assets/models/buildings/BeltDefaultLeftInternalVariant.gltf';
import BELT_RIGHT_DATA from '$lib/assets/models/buildings/BeltDefaultRightInternalVariant.gltf';
import SPLITTER2_LEFT_DATA from '$lib/assets/models/buildings/Splitter1To2LInternalVariant.gltf';
import SPLITTER2_RIGHT_DATA from '$lib/assets/models/buildings/Splitter1To2RInternalVariant.gltf';
import SPLITTERT_DATA from '$lib/assets/models/buildings/SplitterTShapeInternalVariant.gltf';
import MERGER2_LEFT_DATA from '$lib/assets/models/buildings/Merger2To1LInternalVariant.gltf';
import MERGER2_RIGHT_DATA from '$lib/assets/models/buildings/Merger2To1RInternalVariant.gltf';
import MERGERT_DATA from '$lib/assets/models/buildings/MergerTShapeInternalVariant.gltf';
import LIFT1_UP_FORWARD_DATA from '$lib/assets/models/buildings/Lift1UpForwardInternalVariant.gltf';
import LIFT1_UP_BACKWARD_DATA from '$lib/assets/models/buildings/Lift1UpBackwardInternalVariant.gltf';
import LIFT1_UP_LEFT_DATA from '$lib/assets/models/buildings/Lift1UpLeftInternalVariant.gltf';
import LIFT1_UP_RIGHT_DATA from '$lib/assets/models/buildings/Lift1UpRightInternalVariant.gltf';
import LIFT1_DOWN_FORWARD_DATA from '$lib/assets/models/buildings/Lift1DownForwardInternalVariant.gltf';
import LIFT1_DOWN_BACKWARD_DATA from '$lib/assets/models/buildings/Lift1DownBackwardInternalVariant.gltf';
import LIFT1_DOWN_LEFT_DATA from '$lib/assets/models/buildings/Lift1DownLeftInternalVariant.gltf';
import LIFT1_DOWN_RIGHT_DATA from '$lib/assets/models/buildings/Lift1DownRightInternalVariant.gltf';
import LIFT2_UP_FORWARD_DATA from '$lib/assets/models/buildings/Lift2UpForwardInternalVariant.gltf';
import LIFT2_UP_BACKWARD_DATA from '$lib/assets/models/buildings/Lift2UpBackwardInternalVariant.gltf';
import LIFT2_UP_LEFT_DATA from '$lib/assets/models/buildings/Lift2UpLeftInternalVariant.gltf';
import LIFT2_UP_RIGHT_DATA from '$lib/assets/models/buildings/Lift2UpRightInternalVariant.gltf';
import LIFT2_DOWN_FORWARD_DATA from '$lib/assets/models/buildings/Lift2DownForwardInternalVariant.gltf';
import LIFT2_DOWN_BACKWARD_DATA from '$lib/assets/models/buildings/Lift2DownBackwardInternalVariant.gltf';
import LIFT2_DOWN_LEFT_DATA from '$lib/assets/models/buildings/Lift2DownLeftInternalVariant.gltf';
import LIFT2_DOWN_RIGHT_DATA from '$lib/assets/models/buildings/Lift2DownRightInternalVariant.gltf';
import BELT_RECEIVER_DATA from '$lib/assets/models/buildings/BeltPortReceiverInternalVariant.gltf';
import BELT_SENDER_DATA from '$lib/assets/models/buildings/BeltPortSenderInternalVariant.gltf';
import ROTATOR_90CW_DATA from '$lib/assets/models/buildings/RotatorOneQuadInternalVariant.gltf';
import ROTATOR_90CCW_DATA from '$lib/assets/models/buildings/RotatorOneQuadCCWInternalVariant.gltf';
import ROTATOR_180_DATA from '$lib/assets/models/buildings/RotatorHalfInternalVariant.gltf';
import CUTTER_HALF_DATA from '$lib/assets/models/buildings/CutterHalfInternalVariant.gltf';
import CUTTER_DATA from '$lib/assets/models/buildings/CutterDefaultInternalVariant.gltf';
import CUTTER_MIRROR_DATA from '$lib/assets/models/buildings/CutterMirroredInternalVariant.gltf';
import HALVESSWAPPER_DATA from '$lib/assets/models/buildings/HalvesSwapperDefaultInternalVariant.gltf';
import STACKER_DATA from '$lib/assets/models/buildings/StackerDefaultInternalVariant.gltf';
import STACKER_MIRROR_DATA from '$lib/assets/models/buildings/StackerMirroredInternalVariant.gltf';
import UNSTACKER_DATA from '$lib/assets/models/buildings/UnstackerDefaultInternalVariant.gltf';
import PINPUSHER_DATA from '$lib/assets/models/buildings/PinPusherDefaultInternalVariant.gltf';
import EXTRACTOR_DATA from '$lib/assets/models/buildings/ExtractorDefaultInternalVariant.gltf';
import TRASH_DATA from '$lib/assets/models/buildings/TrashDefaultInternalVariant.gltf';
import SHAPEUNPACKER_DATA from '$lib/assets/models/buildings/ShapeUnpackerDefaultInternalVariant.gltf';
import SHAPEPACKER_DATA from '$lib/assets/models/buildings/ShapePackerDefaultInternalVariant.gltf';
import PIPE_FORWARD_DATA from '$lib/assets/models/buildings/PipeForwardInternalVariant.gltf';
import PIPE_LEFT_DATA from '$lib/assets/models/buildings/PipeLeftInternalVariant.gltf';
import PIPE_RIGHT_DATA from '$lib/assets/models/buildings/PipeRightInternalVariant.gltf';
import PIPE_CROSS_DATA from '$lib/assets/models/buildings/PipeCrossInternalVariant.gltf';
import PIPE_JUNCTION_DATA from '$lib/assets/models/buildings/PipeJunctionInternalVariant.gltf';
import PIPE_UP_FORWARD_DATA from '$lib/assets/models/buildings/PipeUpForwardInternalVariant.gltf';
import PIPE_UP_BACKWARD_DATA from '$lib/assets/models/buildings/PipeUpBackwardInternalVariant.gltf';
import PIPE_UP_LEFT_DATA from '$lib/assets/models/buildings/PipeUpLeftInternalVariant.gltf';
import PIPE_UP_RIGHT_DATA from '$lib/assets/models/buildings/PipeUpRightInternalVariant.gltf';
import PIPE_DOWN_FORWARD_DATA from '$lib/assets/models/buildings/PipeDownForwardInternalVariant.gltf';
import PIPE_DOWN_BACKWARD_DATA from '$lib/assets/models/buildings/PipeDownBackwardInternalVariant.gltf';
import PIPE_DOWN_LEFT_DATA from '$lib/assets/models/buildings/PipeDownLeftInternalVariant.gltf';
import PIPE_DOWN_RIGHT_DATA from '$lib/assets/models/buildings/PipeDownRightInternalVariant.gltf';
import PUMP_DATA from '$lib/assets/models/buildings/PumpDefaultInternalVariant.gltf';
import PAINTER_DATA from '$lib/assets/models/buildings/PainterDefaultInternalVariant.gltf';
import PAINTER_FULL_DATA from '$lib/assets/models/buildings/PainterFullInternalVariant.gltf';
import MIXER_DATA from '$lib/assets/models/buildings/MixerDefaultInternalVariant.gltf';
import FLUID_PACKER_DATA from '$lib/assets/models/buildings/FluidPackerDefaultInternalVariant.gltf';
import FLUID_UNPACKER_DATA from '$lib/assets/models/buildings/FluidUnpackerDefaultInternalVariant.gltf';
import TRAINSTATION_LOADER_DATA from '$lib/assets/models/buildings/TrainStationLoaderInternalVariant.gltf';
import TRAINSTATION_UNLOADER_DATA from '$lib/assets/models/buildings/TrainStationUnloaderInternalVariant.gltf';
import CRYSTALGENERATOR_DATA from '$lib/assets/models/buildings/CrystalGeneratorDefaultInternalVariant.gltf';
import FLUID_STORAGE_DATA from '$lib/assets/models/buildings/FluidStorageDefaultInternalVariant.gltf';
import SANDBOX_ITEM_PRODUCER_DATA from '$lib/assets/models/buildings/SandboxItemProducerDefaultInternalVariant.gltf';
import SANDBOX_FLUID_PRODUCER_DATA from '$lib/assets/models/buildings/SandboxFluidProducerDefaultInternalVariant.gltf';
import LABEL_DATA from '$lib/assets/models/buildings/LabelDefaultInternalVariant.gltf';
import BELT_READER_DATA from '$lib/assets/models/buildings/BeltReaderDefaultInternalVariant.gltf';

const BUILDING_MATERIAL = new MeshStandardMaterial({ color: 0xaaaaaa });
const BUILDINGS: Record<BuildingIdentifier, string> = {
    BeltDefaultForwardInternalVariant: BELT_FORWARD_DATA,
    BeltDefaultRightInternalVariant: BELT_RIGHT_DATA,
    BeltDefaultLeftInternalVariant: BELT_LEFT_DATA,
    Splitter1To2LInternalVariant: SPLITTER2_LEFT_DATA,
    Splitter1To2RInternalVariant: SPLITTER2_RIGHT_DATA,
    SplitterTShapeInternalVariant: SPLITTERT_DATA,
    Merger2To1LInternalVariant: MERGER2_LEFT_DATA,
    Merger2To1RInternalVariant: MERGER2_RIGHT_DATA,
    Merger3To1InternalVariant: BELT_FORWARD_DATA, // UNUSED
    MergerTShapeInternalVariant: MERGERT_DATA,
    Lift1DownBackwardInternalVariant: LIFT1_DOWN_BACKWARD_DATA,
    Lift1DownForwardInternalVariant: LIFT1_DOWN_FORWARD_DATA,
    Lift1DownLeftInternalVariant: LIFT1_DOWN_LEFT_DATA,
    Lift1DownRightInternalVariant: LIFT1_DOWN_RIGHT_DATA,
    Lift1UpBackwardInternalVariant: LIFT1_UP_BACKWARD_DATA,
    Lift1UpForwardInternalVariant: LIFT1_UP_FORWARD_DATA,
    Lift1UpLeftInternalVariant: LIFT1_UP_LEFT_DATA,
    Lift1UpRightInternalVariant: LIFT1_UP_RIGHT_DATA,
    Lift2DownBackwardInternalVariant: LIFT2_DOWN_BACKWARD_DATA,
    Lift2DownForwardInternalVariant: LIFT2_DOWN_FORWARD_DATA,
    Lift2DownLeftInternalVariant: LIFT2_DOWN_LEFT_DATA,
    Lift2DownRightInternalVariant: LIFT2_DOWN_RIGHT_DATA,
    Lift2UpBackwardInternalVariant: LIFT2_UP_BACKWARD_DATA,
    Lift2UpForwardInternalVariant: LIFT2_UP_FORWARD_DATA,
    Lift2UpLeftInternalVariant: LIFT2_UP_LEFT_DATA,
    Lift2UpRightInternalVariant: LIFT2_UP_RIGHT_DATA,
    BeltPortSenderInternalVariant: BELT_SENDER_DATA,
    BeltPortReceiverInternalVariant: BELT_RECEIVER_DATA,
    RotatorOneQuadInternalVariant: ROTATOR_90CW_DATA,
    RotatorOneQuadCCWInternalVariant: ROTATOR_90CCW_DATA,
    RotatorHalfInternalVariant: ROTATOR_180_DATA,
    CutterHalfInternalVariant: CUTTER_HALF_DATA,
    CutterDefaultInternalVariant: CUTTER_DATA,
    CutterMirroredInternalVariant: CUTTER_MIRROR_DATA,
    HalvesSwapperDefaultInternalVariant: HALVESSWAPPER_DATA,
    StackerDefaultInternalVariant: STACKER_DATA,
    StackerMirroredInternalVariant: STACKER_MIRROR_DATA,
    UnstackerDefaultInternalVariant: UNSTACKER_DATA,
    PinPusherDefaultInternalVariant: PINPUSHER_DATA,
    ExtractorDefaultInternalVariant: EXTRACTOR_DATA,
    TrashDefaultInternalVariant: TRASH_DATA,
    ShapePackerDefaultInternalVariant: SHAPEPACKER_DATA,
    ShapeUnpackerDefaultInternalVariant: SHAPEUNPACKER_DATA,
    PipeForwardInternalVariant: PIPE_FORWARD_DATA,
    PipeRightInternalVariant: PIPE_RIGHT_DATA,
    PipeLeftInternalVariant: PIPE_LEFT_DATA,
    PipeCrossInternalVariant: PIPE_CROSS_DATA,
    PipeJunctionInternalVariant: PIPE_JUNCTION_DATA,
    PipeDownBackwardInternalVariant: PIPE_DOWN_BACKWARD_DATA,
    PipeDownForwardInternalVariant: PIPE_DOWN_FORWARD_DATA,
    PipeDownLeftInternalVariant: PIPE_DOWN_LEFT_DATA,
    PipeDownRightInternalVariant: PIPE_DOWN_RIGHT_DATA,
    PipeUpBackwardInternalVariant: PIPE_UP_BACKWARD_DATA,
    PipeUpForwardInternalVariant: PIPE_UP_FORWARD_DATA,
    PipeUpLeftInternalVariant: PIPE_UP_LEFT_DATA,
    PipeUpRightInternalVariant: PIPE_UP_RIGHT_DATA,
    PumpDefaultInternalVariant: PUMP_DATA,
    PainterDefaultInternalVariant: PAINTER_DATA,
    PainterFullInternalVariant: PAINTER_FULL_DATA,
    MixerDefaultInternalVariant: MIXER_DATA,
    FluidPackerDefaultInternalVariant: FLUID_PACKER_DATA,
    FluidUnpackerDefaultInternalVariant: FLUID_UNPACKER_DATA,
    TrainStationLoaderInternalVariant: TRAINSTATION_LOADER_DATA,
    TrainStationUnloaderInternalVariant: TRAINSTATION_UNLOADER_DATA,
    CrystalGeneratorDefaultInternalVariant: CRYSTALGENERATOR_DATA,
    FluidStorageDefaultInternalVariant: FLUID_STORAGE_DATA,
    SandboxItemProducerDefaultInternalVariant: SANDBOX_ITEM_PRODUCER_DATA,
    SandboxFluidProducerDefaultInternalVariant: SANDBOX_FLUID_PRODUCER_DATA,
    LabelDefaultInternalVariant: LABEL_DATA,
    BeltReaderDefaultInternalVariant: BELT_READER_DATA,
    ArtistPlaygroundBuildingInternalVariant: BELT_FORWARD_DATA // UNUSED
};

const loader = new GLTFLoader();

export function getBuildingModel(identifier: BuildingIdentifier): Promise<Mesh> {
    return new Promise<Mesh>((resolve, reject) => {
        loader.loadAsync(BUILDINGS[identifier])
            .then(value => {
                return resolve(value.scene.children[0] as Mesh);
            })
            .catch(reject);
    });
}

/**
 * Applies default BULDING_MATERIAL to mesh and children
 * TODO: replace with official material
 * @param mesh Mesh to apply material to recursively for children
 */
export function applyMaterial(mesh: Mesh) {
    mesh.material = BUILDING_MATERIAL;
    if (mesh.children.length < 1) return;

    mesh.children.forEach((child) => applyMaterial(child as Mesh));
};

export const view: Action<HTMLCanvasElement, Blueprint> = (canvas, blueprint) => {
    if (!blueprint) {
        throw new Error('[BLUEPRINT-VIEW] No blueprint identifier provided');
    }

    const scene = new Scene();
    const lights = createLights();
    scene.add(lights);
    const grid = new GridHelper(GRID_SIZE, GRID_SIZE, GRID_COLOR, GRID_COLOR);
    scene.add(grid);
    const camera = createCamera(canvas.width, canvas.height);
    const controls = createControls(camera, canvas);
    const renderer = createRenderer(canvas);

    let minPan: Vector3 = new Vector3(-5, 0, -5);
    let maxPan: Vector3 = new Vector3(5, 0, 5);

    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(canvas.parentElement ?? document.body);
    onResize();
    canvas.addEventListener('keyup', (event) => onCenter(event), true);

    assign(blueprint);
    update();

    function createLights(): Group {
        const lights = new Group();
        const ambientLight = new AmbientLight(0xffffff, 1);
        lights.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 3, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        lights.add(directionalLight);
        return lights;
    }
    function createCamera(width: number, height: number): PerspectiveCamera {
        const camera = new PerspectiveCamera(55, width / height, 0.1, 1000);
        camera.position.y = 5;
        camera.position.z = 5;
        camera.lookAt(0, 0, 0);
        return camera;
    }
    function createControls(camera: Camera, element: HTMLElement): OrbitControls {
        const controls = new OrbitControls(camera, element);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.maxPolarAngle = Math.PI * 0.4;
        controls.minDistance = 1.5;
        controls.maxDistance = 20;
        return controls;
    }
    function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
        const renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas
        });
        ColorManagement.enabled = true;
        return renderer;
    }
    function onCenter(event: KeyboardEvent) {
        if (event.key !== 'c') return;

        event.preventDefault();
        controls.reset();
    }
    function onResize() {
        const width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
        const height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
    }

    function update() {
        requestAnimationFrame(() => update());

        controls.update();
        const _v = controls.target.clone();
        controls.target.clamp(minPan, maxPan);
        _v.sub(controls.target);
        camera.position.sub(_v);

        renderer.render(scene, camera);
    }
    function assign(blueprint: Blueprint) {
        const min = new Vector3();
        const max = new Vector3();
        blueprint.BP.Entries.forEach((entry) => {
            const x = entry.X ?? 0;
            const y = entry.Y ?? 0;
            const l = entry.L ?? 0;
            const r = entry.R ?? 0;

            if (x < min.x) min.x = x;
            if (y < min.z) min.z = y;
            if (x > max.x) max.x = x;
            if (y > max.z) max.z = y;
            minPan = min;
            maxPan = max;

            getBuildingModel(entry.T).then((mesh) => {
                mesh.position.set(x, l, y);
                mesh.rotateY(Math.PI * 1.5 * r - 0.5 * Math.PI);
                applyMaterial(mesh);
                scene.add(mesh);

                switch (entry.T) {
                    case 'BeltDefaultForwardInternalVariant':
                    case 'BeltDefaultLeftInternalVariant':
                    case 'BeltDefaultRightInternalVariant':
                    case 'Merger2To1LInternalVariant':
                    case 'Merger2To1RInternalVariant':
                    case 'MergerTShapeInternalVariant':
                    case 'Splitter1To2LInternalVariant':
                    case 'Splitter1To2RInternalVariant':
                    case 'SplitterTShapeInternalVariant':
                        mesh.children.forEach((child) => (child.visible = false));
                        mesh.children[l].visible = true;
                        break;

                    case 'LabelDefaultInternalVariant':
                        {
                            mesh.children.forEach((child) => (child.visible = false));
                            const text = atob(String(entry.C)).trim().replace(/[\W_]/g, '').toUpperCase();
                            [...text].forEach((char, index, array) => {
                                const letterIndex = char.charCodeAt(0) - 65;
                                const letter = mesh.children[letterIndex].clone();
                                if (array.length > 8) {
                                    const scale = (1 / array.length) * 8;
                                    letter.translateX(index * scale * -0.525);
                                    letter.scale.set(scale, scale, 1);
                                } else {
                                    letter.translateX(index * -0.525);
                                }
                                letter.visible = true;
                                mesh.add(letter);
                            });
                        }
                        break;

                    default:
                        break;
                }
            });
        });
    }

    return {
        update(blueprint) {
            assign(blueprint);
        },
        destroy() {
            resizeObserver.disconnect();
            canvas.removeEventListener('keyup', (event) => onCenter(event), true);
        }
    };
};
