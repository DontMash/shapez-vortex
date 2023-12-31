import type { BlueprintString } from '$lib/blueprint.types';
import { decode } from '$lib/server/blueprint';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const BLUEPRINT = 'SHAPEZ2-1-H4sIADyejGUA/8xaXVPaQBR991c4TB/paDYQnc74UKCoHbTIh1U7fVjJAtumm8xmI9qO/70JMBaRkN27F+iTJJB77sfes3dP/LO3v1+6Ln3Ydw5dt5xd1NrpVXY7/fxOPUUsvSzVEh74XIxK5dkXn4SSnMXpV9+mN/bnT0y/vElvvz8u/7txm93wFm500hvuwnVvisEC1WBDmgSqGcoJlf65UEwKGlxTyalQpfkDz+UczCMbzA4fjZUporcOcRmhxYbGAFXjkLpRwFUK4vRC0jGFq1jBtUzhXDBcrzumETPFc4zxLpgcMUl6oWMcHLEAMymciW1Q2hxQW7VDqbpM+ExiwrWWftBZun4F32EDxh+MHVjPXas82DaXmfqAz22tvLxviuu0Qt4c9xnD43KhEfwGuFELf1NcaQhuxZ0GWLA0F3IL+Q+4heycW8i2uYXsllvIbrmF7JhbyC65hWyRW8hWueWN9RYfKqcfYfGGWxTNHA+HI/KsQ/igss74yuFmCtYIJwKYPNcEMT+ZmQegdFaLikdy0lujg5+QgAk8xZCKOnA4QIQGCNB2c3AWDKz7gMUDNWNhLxLkXqyaAOK3ojETIHemB883oLpHcDRgfObCS0/SeDyfLm2LqQPGRVdRxUPRCukKgWThiXr2xMHB8YmVH1pssehXXwRongEkzGz4aafFZxJWFAQlIXOhLyILJwiKgtNhWR1gHnjmmafCvw8fzxX71ZahnwxyoZdXQmNU+01Pm5O7XtTw+5fOlXvd8K9OTqx81CvVzOdmkHDf0OnapPbjnjw+DLjzZMxjhcmsJ9mJ6YwGQ1vKNM5Jm4t2Eo+hC+fVSeKFkwnKwSF3PyUI54RFY7YyQe7OS+AzcUVn7yNIpwztSYaADxVEOx7bkX69dUA9VmajE6b7Xyi/CHaVUBNrWl352nq9/tUQgGgCACjnjXbgFlNMxJB0BC0sFA1hpWUMPdEteieVAX1OxCCbrmzFipVR1GUYx7ZV91ZZRtOLPJ06I6lFOZFg1DrHNMaesGy+lbeUEIUowHAxw7feMYyixdCEtMGAipCWfSw9CFQ3HDVIM05AyVwYErD3ilqP4LZe1QAOvfM8aKwImo82FpbWXDxRUJ5BAI9H6+D0WnEG30yCwLIVCyOdnYstdAwXhGinnVRMMevyKVY0OGWCyWwEBhbWKZq0LvgjJKbbpcppLZJpHrtpMHTEEM7xsIW6mSlfGxt96s/dRLBPAVr/qbapU0FulCinBBeyb21oFZGdrSKyrVVEdrmKCNYqInpyKYzoHFNumYFdcClDyWxeMGmtwTMaPLC4O6FRhPVKo3BH7CqL/dcDogETaiwI9UWskN4PzYREes8C3ZcGH2v9u5vLwxeQ6d/ve9mn578CDAACIuZYUDEAAA==$';

export const load = (({ url }) => {
    try {
        const blueprint = decode(url.searchParams.get('blueprint-identifier') as BlueprintString ?? BLUEPRINT);
        if (blueprint.BP.$type !== 'Building') {
            throw error(400, { message: 'Invalid blueprint identifier: Not a building blueprint' });
        } else {
            return {
                seo: {
                    title: 'Shape Viewer',
                    description: 'View and interact with the 3D visualization of a blueprint. Explore the blueprints\'s multiple layers and parts.',
                    keywords: ['Shapez', 'Shapez 2', 'Viewer', '3D', 'Visualization', 'Blueprint', 'Tool'],
                    og: {
                        title: 'Blueprint Viewer - View and interact with the 3D visualization of a blueprint',
                        type: 'website',
                        image: `${url.origin}/favicon.png`,
                        url: url.href,
                    },
                },
                blueprint,
            };
        }
    } catch (err) {
        throw error(400, { message: (err as Error).message });
    }
}) satisfies PageServerLoad;
