import { encode, type Blueprint } from '$lib/server/blueprint';
import { error, type RequestHandler } from '@sveltejs/kit';


export const POST = (({ request }) => new Promise<Response>(
    (resolve, reject) => {
        request.json()
            .then((value) => {
                if (!(value instanceof Object)) return reject(error(400, 'invalid request body'));

                const blueprint = value as Blueprint;
                try {
                    const data = encode(blueprint);                    
                    return resolve(new Response(data));
                } catch (reason) {
                    const message = (reason as Error).message;
                    return reject(error(400, message));
                }
            }).catch(reject);
    })
) satisfies RequestHandler;
