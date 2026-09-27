# Organize the repository as a monorepo with service-owned apps

We will keep SvelteKit, PocketBase, and the Caddy proxy in one repository so changes across services can be coordinated and SvelteKit code can later be extracted into shared packages. Each service owns its own files under `apps/`, while repository-level Compose files assemble the services; the SvelteKit app remains hosted on Vercel rather than gaining a Docker deployment in this migration. We chose this over splitting services into separate repositories or extracting packages before there is a concrete boundary to extract.
