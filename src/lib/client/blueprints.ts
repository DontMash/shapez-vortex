import type { Action, ActionReturn } from 'svelte/action';
import {
	type Blueprint,
	type BlueprintBuilding,
	type BlueprintIsland,
	BLUEPRINT_GRID_SIZE,
	type BlueprintBuildingIdentifier,
	BLUEPRINT_GRID_COLOR,
	ISLAND_LAYOUT_UNIT,
	type BlueprintBuildingEntry
} from '$lib/blueprint.types';
import {
	AmbientLight,
	Camera,
	DirectionalLight,
	GridHelper,
	Group,
	MOUSE,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	TextureLoader,
	UniformsUtils,
	Vector3,
	WebGLRenderer,
	type IUniform,
	Texture,
	Color
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla/dist/three-custom-shader-material-vanilla.cjs';

import BELT_FORWARD_DATA from '$lib/assets/models/buildings/BeltDefaultForwardInternalVariant.gltf';
import BELT_LEFT_DATA from '$lib/assets/models/buildings/BeltDefaultLeftInternalVariant.gltf';
import BELT_RIGHT_DATA from '$lib/assets/models/buildings/BeltDefaultRightInternalVariant.gltf';
import SPLITTER2_LEFT_DATA from '$lib/assets/models/buildings/Splitter1To2LInternalVariant.gltf';
import SPLITTER2_RIGHT_DATA from '$lib/assets/models/buildings/Splitter1To2RInternalVariant.gltf';
import SPLITTERT_DATA from '$lib/assets/models/buildings/SplitterTShapeInternalVariant.gltf';
import MERGER2_LEFT_DATA from '$lib/assets/models/buildings/Merger2To1LInternalVariant.gltf';
import MERGER2_RIGHT_DATA from '$lib/assets/models/buildings/Merger2To1RInternalVariant.gltf';
import MERGERT_DATA from '$lib/assets/models/buildings/MergerTShapeInternalVariant.gltf';
import MERGER3_DATA from '$lib/assets/models/buildings/Merger3To1InternalVariant.gltf';
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

import ERROR_DATA from '$lib/assets/models/error.gltf';

import COLOR_MAP from '$lib/assets/images/MaterialLUT.png';
import BUILDING_VERTEXSHADER from '$lib/assets/shaders/building/building.vs?raw';
import BUILDING_FRAGMENTSHADER from '$lib/assets/shaders/building/building.fs?raw';

const BUILDINGS: Record<BlueprintBuildingIdentifier, string> = {
	BeltDefaultForwardInternalVariant: BELT_FORWARD_DATA,
	BeltDefaultLeftInternalVariant: BELT_LEFT_DATA,
	BeltDefaultRightInternalVariant: BELT_RIGHT_DATA,
	BeltDefaultLeftInternalVariantMirrored: BELT_RIGHT_DATA,
	Splitter1To2LInternalVariant: SPLITTER2_LEFT_DATA,
	Splitter1To2RInternalVariant: SPLITTER2_RIGHT_DATA,
	Splitter1To2LInternalVariantMirrored: SPLITTER2_RIGHT_DATA,
	SplitterTShapeInternalVariant: SPLITTERT_DATA,
	Merger2To1LInternalVariant: MERGER2_LEFT_DATA,
	Merger2To1RInternalVariant: MERGER2_RIGHT_DATA,
	Merger2To1LInternalVariantMirrored: MERGER2_RIGHT_DATA,
	Merger3To1InternalVariant: MERGER3_DATA,
	MergerTShapeInternalVariant: MERGERT_DATA,
	Lift1DownBackwardInternalVariant: LIFT1_DOWN_BACKWARD_DATA,
	Lift1DownForwardInternalVariant: LIFT1_DOWN_FORWARD_DATA,
	Lift1DownLeftInternalVariant: LIFT1_DOWN_LEFT_DATA,
	Lift1DownRightInternalVariant: LIFT1_DOWN_RIGHT_DATA,
	Lift1DownLeftInternalVariantMirrored: LIFT1_DOWN_RIGHT_DATA,
	Lift1UpBackwardInternalVariant: LIFT1_UP_BACKWARD_DATA,
	Lift1UpForwardInternalVariant: LIFT1_UP_FORWARD_DATA,
	Lift1UpLeftInternalVariant: LIFT1_UP_LEFT_DATA,
	Lift1UpRightInternalVariant: LIFT1_UP_RIGHT_DATA,
	Lift1UpLeftInternalVariantMirrored: LIFT1_UP_RIGHT_DATA,
	Lift2DownBackwardInternalVariant: LIFT2_DOWN_BACKWARD_DATA,
	Lift2DownForwardInternalVariant: LIFT2_DOWN_FORWARD_DATA,
	Lift2DownLeftInternalVariant: LIFT2_DOWN_LEFT_DATA,
	Lift2DownRightInternalVariant: LIFT2_DOWN_RIGHT_DATA,
	Lift2DownLeftInternalVariantMirrored: LIFT2_DOWN_RIGHT_DATA,
	Lift2UpBackwardInternalVariant: LIFT2_UP_BACKWARD_DATA,
	Lift2UpForwardInternalVariant: LIFT2_UP_FORWARD_DATA,
	Lift2UpLeftInternalVariant: LIFT2_UP_LEFT_DATA,
	Lift2UpRightInternalVariant: LIFT2_UP_RIGHT_DATA,
	Lift2UpLeftInternalVariantMirrored: LIFT2_UP_RIGHT_DATA,
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
	PipeLeftInternalVariant: PIPE_LEFT_DATA,
	PipeRightInternalVariant: PIPE_RIGHT_DATA,
	PipeLeftInternalVariantMirrored: PIPE_RIGHT_DATA,
	PipeCrossInternalVariant: PIPE_CROSS_DATA,
	PipeJunctionInternalVariant: PIPE_JUNCTION_DATA,
	PipeDownBackwardInternalVariant: PIPE_DOWN_BACKWARD_DATA,
	PipeDownForwardInternalVariant: PIPE_DOWN_FORWARD_DATA,
	PipeDownLeftInternalVariant: PIPE_DOWN_LEFT_DATA,
	PipeDownRightInternalVariant: PIPE_DOWN_RIGHT_DATA,
	PipeDownLeftInternalVariantMirrored: PIPE_DOWN_RIGHT_DATA,
	PipeUpBackwardInternalVariant: PIPE_UP_BACKWARD_DATA,
	PipeUpForwardInternalVariant: PIPE_UP_FORWARD_DATA,
	PipeUpLeftInternalVariant: PIPE_UP_LEFT_DATA,
	PipeUpRightInternalVariant: PIPE_UP_RIGHT_DATA,
	PipeUpLeftInternalVariantMirrored: PIPE_UP_RIGHT_DATA,
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
	ArtistPlaygroundBuildingInternalVariant: ERROR_DATA // UNUSED
};

type Parameters = {
	blueprint: Blueprint;
	enableZoom?: boolean | undefined;
	isCenter?: boolean | undefined;
};
type Attributes = { 'on:load': (e: CustomEvent<void>) => void; center: () => void };
export const view: Action<HTMLCanvasElement, Parameters, Attributes> = (canvas, params) => {
	if (!params) {
		throw new Error('[BLUEPRINT-VIEW] No blueprint view parameters provided');
	}
	const { blueprint, enableZoom } = params;

	const scene = new Scene();
	const lights = createLights();
	scene.add(lights);
	const grid = new GridHelper(
		BLUEPRINT_GRID_SIZE,
		BLUEPRINT_GRID_SIZE,
		BLUEPRINT_GRID_COLOR,
		BLUEPRINT_GRID_COLOR
	);
	scene.add(grid);
	const camera = createCamera(canvas.width, canvas.height);
	const controls = createControls(camera, canvas);
	const renderer = createRenderer(canvas);
	const loader = new GLTFLoader();

	const resizeObserver = new ResizeObserver(() => onResize());
	resizeObserver.observe(canvas.parentElement ?? document.body);
	onResize();
	canvas.addEventListener('keyup', (event) => onCenter(event), true);

	assign(blueprint);
	update();

	function createLights(): Group {
		const lights = new Group();
		const ambientLight = new AmbientLight(0xffffff, 0.2);
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
		const distance = 15;
		camera.position.y = distance;
		camera.position.z = distance;
		camera.lookAt(0, 0, 0);
		return camera;
	}
	function createControls(camera: Camera, element: HTMLElement): OrbitControls {
		const controls = new OrbitControls(camera, element);
		controls.enableZoom = enableZoom !== false;
		controls.enableDamping = true;
		controls.maxPolarAngle = Math.PI * 0.4;
		controls.minDistance = 5;
		controls.maxDistance = 40;
		controls.mouseButtons = {
			LEFT: MOUSE.PAN,
			RIGHT: MOUSE.ROTATE
		};
		controls.keys = {
			LEFT: 'KeyA',
			UP: 'KeyW',
			RIGHT: 'KeyD',
			BOTTOM: 'KeyS'
		};
		controls.keyPanSpeed = 50;
		controls.screenSpacePanning = false;
		controls.listenToKeyEvents(element);
		return controls;
	}
	function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
		const renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas,
			preserveDrawingBuffer: true
		});
		return renderer;
	}
	function onCenter(event: KeyboardEvent) {
		if (event.key !== 'c') return;

		reset();
	}
	function onResize() {
		const width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
		const height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	function getBuildingModel(identifier: BlueprintBuildingIdentifier): Promise<Mesh> {
		return new Promise<Mesh>((resolve, reject) => {
			const building = BUILDINGS[identifier] ?? ERROR_DATA;
			loader
				.loadAsync(building)
				.then((value) => {
					return resolve(value.scene.children[0] as Mesh);
				})
				.catch(reject);
		});
	}
	function createBuilding(entry: BlueprintBuildingEntry, mesh: Mesh) {
		const x = entry.X ?? 0;
		const y = entry.Y ?? 0;
		const l = entry.L ?? 0;

		mesh.position.set(x, l, y);
		const rotation = Math.PI * 1.5 * (entry.R ?? 0) - 0.5 * Math.PI;
		mesh.rotateY(rotation);
		applyMaterial(entry, mesh);

		switch (entry.T) {
			case 'BeltDefaultForwardInternalVariant':
			case 'BeltDefaultLeftInternalVariant':
			case 'BeltDefaultRightInternalVariant':
			case 'Merger2To1LInternalVariant':
			case 'Merger2To1RInternalVariant':
			case 'MergerTShapeInternalVariant':
			case 'Merger3To1InternalVariant':
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
		return mesh;
	}
	const textureLoader = new TextureLoader();
	textureLoader.loadAsync(COLOR_MAP).then((texture) => {
		const uniforms = { lutTexture: { value: texture } } satisfies Record<string, IUniform<Texture>>;
		BUILDING_MATERIAL.uniforms = UniformsUtils.merge([BUILDING_MATERIAL.uniforms, uniforms]);
	});
	const BUILDING_COLOR_ACCENT = new Color(0xff9421);
	const BUILDING_MATERIAL = new CustomShaderMaterial({
		baseMaterial: MeshStandardMaterial,
		vertexShader: BUILDING_VERTEXSHADER,
		fragmentShader: BUILDING_FRAGMENTSHADER,
		uniforms: UniformsUtils.merge([{ accentColor: { value: BUILDING_COLOR_ACCENT } }]),
		silent: true
	});
	const BUILDING_MATERIAL_GLASS = new MeshStandardMaterial({
		color: 0xdddddd,
		opacity: 0.3,
		transparent: true
	});
	const BUILDING_MATERIAL_ERROR = new MeshBasicMaterial({ color: 0xff0000 });
	function applyMaterial(entry: BlueprintBuildingEntry, mesh: Mesh) {
		const name = mesh.name.toLowerCase();
		if (name === 'error') {
			mesh.material = BUILDING_MATERIAL_ERROR;
			console.error(`unknown building ${entry.T}`);
		} else if (name.includes('glas')) {
			mesh.material = BUILDING_MATERIAL_GLASS;
		} else {
			switch (entry.T) {
				case 'PipeForwardInternalVariant':
				case 'PipeLeftInternalVariant':
				case 'PipeRightInternalVariant':
				case 'PipeCrossInternalVariant':
				case 'PipeJunctionInternalVariant':
				case 'PipeUpForwardInternalVariant':
				case 'PipeUpLeftInternalVariant':
				case 'PipeUpRightInternalVariant':
				case 'PipeUpBackwardInternalVariant':
				case 'PipeDownForwardInternalVariant':
				case 'PipeDownLeftInternalVariant':
				case 'PipeDownRightInternalVariant':
				case 'PipeDownBackwardInternalVariant':
					mesh.material = BUILDING_MATERIAL_GLASS;
					break;

				default:
					mesh.material = BUILDING_MATERIAL;
					break;
			}
		}
		if (mesh.children.length < 1) return;

		mesh.children.forEach((child) => applyMaterial(entry, child as Mesh));
	}

	function update() {
		requestAnimationFrame(() => update());

		controls.update();
		renderer.render(scene, camera);
	}
	async function assign(blueprint: Blueprint) {
		if (blueprint.BP.$type === 'Island') {
			return assignBlueprintIsland(blueprint.BP).then(() => {
				canvas.dispatchEvent(new CustomEvent('load'));
			});
		}
		return assignBlueprintBuilding(blueprint.BP).then(() => {
			canvas.dispatchEvent(new CustomEvent('load'));
		});
	}
	async function assignBlueprintIsland(blueprint: BlueprintIsland) {
		return new Promise<void>((resolve, reject) => {
			const islandPromises = blueprint.Entries.map<Promise<void>>(
				(islandEntry) =>
					new Promise<void>((resolve, reject) => {
						const x = islandEntry.X ?? 0;
						const y = islandEntry.Y ?? 0;
						const position = new Vector3(x, 0, y);

						const group = new Group();
						group.position
							.add(position)
							.multiplyScalar(ISLAND_LAYOUT_UNIT)
							.sub(new Vector3(ISLAND_LAYOUT_UNIT * 0.5, 0, ISLAND_LAYOUT_UNIT * 0.5));
						scene.add(group);

						const buildingPromises = islandEntry.B.Entries.map<Promise<void>>(
							(buildingEntry) =>
								new Promise<void>((resolve, reject) => {
									getBuildingModel(buildingEntry.T)
										.then((mesh) => {
											const building = createBuilding(buildingEntry, mesh);
											group.add(building);
											return resolve();
										})
										.catch(reject);
								})
						);
						Promise.all(buildingPromises)
							.then(() => resolve())
							.catch(reject);
					})
			);
			Promise.all(islandPromises)
				.then(() => resolve())
				.catch(reject);
		});
	}
	async function assignBlueprintBuilding(blueprint: BlueprintBuilding) {
		return new Promise<void>((resolve, reject) => {
			const buildingPromises = blueprint.Entries.map<Promise<void>>(
				(entry) =>
					new Promise<void>((resolve, reject) => {
						getBuildingModel(entry.T)
							.then((mesh) => {
								const building = createBuilding(entry, mesh);
								scene.add(building);
								return resolve();
							})
							.catch(reject);
					})
			);
			Promise.all(buildingPromises)
				.then(() => resolve())
				.catch(reject);
		});
	}
	function reset() {
		controls.enableDamping = false;
		controls.update();
		controls.reset();
		controls.enableDamping = true;
	}

	return {
		update(params) {
			const { blueprint: updateBlueprint, enableZoom, isCenter } = params;

			if (updateBlueprint !== blueprint) {
				assign(updateBlueprint);
				reset();
			}
			if (isCenter) {
				reset();
			}
			controls.enableZoom = !!enableZoom;
		},
		destroy() {
			resizeObserver.disconnect();
			canvas.removeEventListener('keyup', (event) => onCenter(event), true);
			controls.stopListenToKeyEvents();
		}
	} satisfies ActionReturn<Parameters, Attributes>;
};
