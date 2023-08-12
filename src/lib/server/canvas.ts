import EventEmitter from 'events';
import createContext, { WebGLRenderingContext } from 'gl';
import { Canvas, type SKRSContext2D } from '@napi-rs/canvas';

global.WebGLRenderingContext = WebGLRenderingContext;

export class NodeCanvas {
    public style = {};

    private emitter = new EventEmitter();
    private canvas: Canvas;
    private twod_ctx: SKRSContext2D | undefined;
    private gl_ctx: WebGLRenderingContext | undefined;

    constructor(width: number, height: number) {
        this.canvas = new Canvas(width, height);
    }

    get width(): number {
        return this.canvas.width;
    }
    set width(value: number) {
        this.canvas.width = value;
    }
    get height(): number {
        return this.canvas.height;
    }
    set height(value: number) {
        this.canvas.height = value;
    }

    addEventListener(type: keyof OffscreenCanvasEventMap, listener: () => void): void {
        this.emitter.addListener(type, listener);
    };

    removeEventListener(type: keyof OffscreenCanvasEventMap, listener: () => void): void {
        if (listener) {
            this.emitter.removeListener(type, listener);
            return;
        }
        return this.removeAllListeners(type);
    };

    removeAllListeners(type: keyof OffscreenCanvasEventMap): void {
        this.emitter.removeAllListeners(type);
    };

    dispatchEvent(event: Event) {
        Object.assign(event, { target: this });
        return this.emitter.emit(event.type, event);
    }

    getContext(): WebGLRenderingContext {
        this.gl_ctx = createContext(this.canvas.width, this.canvas.height);
        this.twod_ctx = this.canvas.getContext('2d');
        return this.gl_ctx;
    }

    toBuffer(mime: 'image/png'): Buffer {
        this.updateImage();
        return this.canvas.toBuffer(mime);
    }

    private updateImage() {
        if (!this.twod_ctx || !this.gl_ctx)
            return;

        const { width, height } = this.canvas;
        const data = this.twod_ctx.getImageData(0, 0, width, height);

        const pixels = new Uint8Array(width * height * 4);
        this.gl_ctx.readPixels(0, 0, width, height, this.gl_ctx.RGBA, this.gl_ctx.UNSIGNED_BYTE, pixels);

        for (let i = 0; i < height; i++) {
            for (let k = 0; k < width; k++) {
                const col = k;
                const row = height - i - 1;
                for (let k = 0; k < 4; k++) {
                    const index = 4 * (row * width + col) + k;
                    const index2 = 4 * (i * width + col) + k;
                    data.data[index] = pixels[index2];
                }
            }
        }
        this.twod_ctx.putImageData(data, 0, 0);
    }
}

export function createCanvas(width: number, height: number) {
    return new NodeCanvas(width, height);
}
