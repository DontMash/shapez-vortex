import type { Action, ActionReturn } from 'svelte/action';
import { PerspectiveCamera, Vector3 } from 'three';
import { createShapeModel, createShapeRenderer, type ShapeRenderer } from '$lib/client/shapes';
import { type ShapeIdentifier } from '$lib/shape.types';
import { parse } from '$lib/shape';
import { browser } from '$app/environment';

const DEFAULT_SIZE = 256;

let shapeCanvas: HTMLCanvasElement | undefined;
let shapeRenderer: ShapeRenderer | undefined;
let shapeCamera: PerspectiveCamera | undefined;
if (browser) {
    shapeCanvas = document.createElement('canvas');
    shapeRenderer = createShapeRenderer(shapeCanvas);
    shapeCamera = new PerspectiveCamera(55, 1, 0.1, 10);
}

type Parameters = {
    identifier: ShapeIdentifier,
    size?: number,
    position?: Vector3,
};
type Attributes = {
    'on:shapeload': (event: CustomEvent<string>) => void;
};
export const shape: Action<HTMLImageElement, Parameters, Attributes> = (img, params) => {
    if (!params) {
        throw new Error('[SHAPE-IMAGE] No params provided');
    }
    set(params);

    function set(params: Parameters) {
        if (!shapeCanvas || !shapeRenderer || !shapeCamera) {
            throw new Error('[SHAPE-IMAGE] required ressources not available');
        }

        const {
            identifier,
            size = DEFAULT_SIZE,
            position = new Vector3(0, 1.25, 0),
        } = params;

        resize(size);
        shapeCamera.position.copy(position);
        shapeCamera.lookAt(0, 0, 0);

        createShapeImageUrl(identifier);
    }
    function resize(size: number) {
        if (!shapeCanvas || !shapeRenderer || !shapeCamera) {
            throw new Error('[SHAPE-IMAGE] required ressources not available');
        }
        
        shapeRenderer.resize(size, size);
        shapeCamera.aspect = size / size;
    }
    async function createShapeImageUrl(identifier: ShapeIdentifier): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const shapeModel = createShapeModel();
            if (!shapeModel) {
                return reject(new Error('Shape model not available'));
            }
            const shape = parse(identifier);
            shapeModel
                .assign(shape)
                .then(() => {
                    if (!shapeRenderer) {
                        return reject(new Error('Shape renderer not available'));
                    }
                    if (!shapeCamera) {
                        return reject(new Error('Shape camera not available'));
                    }
                    shapeRenderer.render(shapeModel.scene, shapeCamera);

                    if (!shapeCanvas) {
                        return reject(new Error('Shape canvas not available'));
                    }
                    shapeCanvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                return reject(new Error('Failed to create blob'));
                            }
                            const url = URL.createObjectURL(blob);
                            img.src = url;
                            img.dispatchEvent(new CustomEvent('shapeload', { detail: url }));
                            return resolve(url);
                        },
                        'image/png',
                        1
                    );

                    shapeRenderer.dispose();
                })
                .catch(reject);
        });
    }

    return {
        update(params) {
            set(params);
        }
    } satisfies ActionReturn<Parameters, Attributes>;
};
