import { createCanvas } from '$lib/server/canvas';
import type { RequestHandler } from '@sveltejs/kit';
import { ShapeRenderer, ShapeView } from 'shapez-viewer';

global.ProgressEvent = (function () { }) as unknown as { new(type: string, eventInitDict?: ProgressEventInit | undefined): ProgressEvent<EventTarget>; prototype: ProgressEvent<EventTarget>; };

export const GET = (({ url }) =>
    new Promise<Response>((resolve, reject) => {
        const identifier = url.searchParams.get('identifier');
        const size = 256;
        const canvas = createCanvas(size, size);
        const renderer = new ShapeRenderer(canvas as unknown as HTMLCanvasElement, canvas.width, canvas.height);
        const view = identifier ? new ShapeView(identifier) : new ShapeView();
        view.init()
            .then(() => {
                renderer.update([view]);
                const image = canvas.toBuffer('image/png');
                return resolve(new Response(image));
            }).catch(reject);
    })) satisfies RequestHandler;
