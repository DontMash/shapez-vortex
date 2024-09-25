import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		seo: {
			title: 'Upload',
			description: 'Share your content with the community.',
			keywords: ['Blueprint', 'Scenario', 'Content', 'Upload']
		}
	};
}) satisfies PageServerLoad;
