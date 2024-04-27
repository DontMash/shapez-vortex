import type { Action, ActionReturn } from 'svelte/action';
import { PerspectiveCamera, Camera, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createShapeModel, createShapeRenderer } from '$lib/client/shapes';
import { type Shape } from '$lib/shape.types';

const DEFAULT_CAMERA_POSITION = new Vector3(0, 2, 1.5);

type Parameters = {
    data: Shape;
    isReset?: boolean | undefined;
    isTop?: boolean | undefined;
    isExtended?: boolean | undefined;
    isExpanded?: boolean | undefined;
    cameraPosition?: Vector3 | undefined;
    width?: number | undefined;
    height?: number | undefined;
    autoResize?: boolean | undefined;
};
type Attributes = {
    'on:load': (e: CustomEvent<string>) => void;
};
export const view: Action<HTMLCanvasElement, Parameters, Attributes> = (canvas, params) => {
    if (!params) {
        throw new Error('[SHAPE-VIEW] No params provided');
    }

    const {
        data,
        isExtended,
        isExpanded,
        cameraPosition = DEFAULT_CAMERA_POSITION,
        width,
        height,
        autoResize = true
    } = params;

    const renderer = createShapeRenderer(canvas);
    const shape = createShapeModel();
    const camera = createCamera(canvas.width, canvas.height, cameraPosition);
    const controls = createControls(camera, canvas);

    const resizeObserver = new ResizeObserver(() => onResize());
    if (autoResize) {
        resizeObserver.observe(canvas.parentElement ?? document.body);
    }
    onResize();

    assign(data);
    isExtended ? shape.extend() : shape.contract();
    isExpanded ? shape.expand() : shape.collapse();
    update();

    function createCamera(width: number, height: number, position: Vector3): PerspectiveCamera {
        const camera = new PerspectiveCamera(55, width / height, 0.1, 10);
        camera.position.copy(position);
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

    function onResize() {
        const renderWidth = canvas.parentElement?.offsetWidth ?? width ?? window.innerWidth;
        const renderHeight = canvas.parentElement?.offsetHeight ?? height ?? window.innerHeight;
        camera.aspect = renderWidth / renderHeight;
        camera.updateProjectionMatrix();

        renderer.resize(renderWidth, renderHeight);
    }

    function update() {
        requestAnimationFrame(() => update());
        controls.update();
        renderer.render(shape.scene, camera);
    }
    function reset() {
        controls.enableDamping = false;
        controls.update();
        controls.reset();
        controls.enableDamping = true;
    }
    function top() {
        controls.enableDamping = false;
        controls.update();
        camera.position.set(0, 2.5, 0);
        camera.lookAt(0, 0, 0);
        controls.enableDamping = true;
    }
    function assign(data: Shape) {
        shape.assign(data)
            .then(() => canvas.dispatchEvent(new CustomEvent('load')))
            .catch(() => { throw new Error('Shape assignment failed'); });
    }

    return {
        update(params) {
            if (params.isReset) {
                reset();
            }
            if (params.isTop) {
                top();
            }
            params.isExtended ? shape.extend() : shape.contract();
            params.isExpanded ? shape.expand() : shape.collapse();
            if (params.data !== data) {
                assign(params.data);
            }
        },
        destroy() {
            resizeObserver.disconnect();
            renderer.dispose();
        }
    } satisfies ActionReturn<Parameters, Attributes>;
};
