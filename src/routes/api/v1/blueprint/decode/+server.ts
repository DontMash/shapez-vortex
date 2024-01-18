import { error, type RequestHandler } from '@sveltejs/kit';
import type { BlueprintIdentifier } from '$lib/blueprint.types';
import { decode } from '$lib/server/blueprint';

export const POST = (({ request }) => new Promise<Response>(
    (resolve, reject) => {
        request.text()
            .then((value) => {
                const blueprint = value as BlueprintIdentifier;
                try {
                    const data = decode(blueprint);
                    return resolve(new Response(JSON.stringify(data)));
                } catch (reason) {
                    const message = (reason as Error).message;
                    return reject(error(400, message));
                }
            }).catch(reject);
    })
) satisfies RequestHandler;
