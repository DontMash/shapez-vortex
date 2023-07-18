import { type BlueprintString, decode } from '$lib/server/blueprint';
import { error, type RequestHandler } from '@sveltejs/kit';


export const POST = (({ request }) => new Promise<Response>(
    (resolve, reject) => {
        request.text()
            .then((value) => {
                const blueprint = value as BlueprintString;
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
