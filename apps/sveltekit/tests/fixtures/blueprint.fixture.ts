import { encode } from '$lib/blueprint';
import { GAME_VERSION, type Blueprint } from '$lib/blueprint.types';
import type { BlueprintFormData } from '$lib/blueprint.schema';

export type BlueprintFixture = BlueprintFormData;

const minimalBlueprint: Blueprint = {
  V: GAME_VERSION,
  BP: {
    $type: 'Building',
    Entries: [{ T: 'BeltDefaultForwardInternalVariant', X: 0, Y: 0 }],
    Icon: { Data: [] },
  },
};

export const blueprintFixture: BlueprintFixture = {
  title: 'Test Blueprint',
  data: encode(minimalBlueprint),
  description: 'A test blueprint',
  tags: ['$test'],
  images: [new File(['test'], 'test.png', { type: 'image/png' })],
};
