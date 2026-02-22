import type { LayoutLoad } from './$types';
import type { BlueprintRecord } from '$lib/blueprint';
import type { User } from '$lib/user.schema';

export const load = (async ({ fetch }) => {
  const blueprintsPromise = fetch('/api/v1/blueprint?perPage=100').then(
    async (res) => {
      if (res.ok) {
        const data = await res.json();
        return data.items as Array<BlueprintRecord>;
      }
      return [];
    },
  );

  const usersPromise = fetch('/api/v1/user').then(async (res) => {
    if (res.ok) {
      return (await res.json()) as Array<User>;
    }
    return [];
  });

  return {
    searchBlueprints: blueprintsPromise,
    searchUsers: usersPromise,
  };
}) satisfies LayoutLoad;
