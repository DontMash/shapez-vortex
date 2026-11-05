import type { Blueprint, BlueprintIdentifier } from '$lib/blueprint.types';

const blueprintCodecFixtures: Record<
  'building' | 'island',
  { identifier: BlueprintIdentifier; blueprint: Blueprint }
> = {
  building: {
    identifier:
      'SHAPEZ2-1-H4sIAAAAAAAC/5XOPwvCMBCH4e/ywzGC1fov4NJWpeAgIkURh9NGDZQoaYJIyXc3Rt1c5LY73odrUIBHnXHMkCzBG7TM4ybAkVhZlVKdwZAfr+p1ysgQ+A71hW6Cp/Y92DuGqTJaitpfG6xftahMJk5kKzO76jvpMldGaEVVQVqSMp7dgLe7DFvwHsPCf8GwAveb1AM0L+rDfDSBY3+JcQDb/SB2gxh9idQaX3yQn/Ug1MOQ9dzeuSdbTCI6HwEAAA==$',
    blueprint: {
      V: 1094,
      BP: {
        $type: 'Building',
        Icon: { Data: ['shape:CuCuCuCu'] },
        Entries: [
          {
            T: 'BeltDefaultForwardInternalVariant',
            X: -2,
            Y: 3,
            L: 1,
            R: 2,
            C: 'aGVsbG8=',
          },
          {
            T: 'BeltDefaultForwardInternalVariant',
            X: 4,
            Y: -5,
            L: 2,
            R: 1,
          },
          { T: 'CutterDefaultInternalVariant', X: 6, Y: 7, R: 3 },
        ],
      },
    },
  },
  island: {
    identifier:
      'SHAPEZ2-1-H4sIAAAAAAAC/6WSX0vDMBTFv8vBxwz6Z+oM+NJOR6EPMqQoMsbVRi2UdKQJMkq/u1nSgLAJQ7mP95zzuydkQAUeRzdzhuwBfMCF3u8EOIq+JVmDoXjr5GGxJE3gL+g/aSf42vjBZmS4k1o1orfbAY/WW9K+M3obW/cT+CxmeAZPGNYWZTk/MZlp2rqRH7+CcuPnJCgTrV6KdzKtvu/UF6m6kFooSW1FqiGp/QWRO8Ciy3BGypBbP62q/nW1uMXIfGButPVPkSezEpeV+jLjZgzOqXPiValTzeZOlpzd+d8do3DOma54ch31SLelV1w6xVV4tT8VOUoPP+PahS8O+G9kAb1miQIAAA==$',
    blueprint: {
      V: 1094,
      BP: {
        $type: 'Island',
        Icon: { Data: ['shape:RuRuRuRu'] },
        Entries: [
          {
            T: 'Layout_1',
            X: -1,
            Y: 2,
            R: 1,
            B: {
              $type: 'Building',
              Icon: { Data: ['shape:CuCuCuCu'] },
              Entries: [
                {
                  T: 'BeltDefaultForwardInternalVariant',
                  X: 0,
                  Y: 1,
                  L: 2,
                  R: 3,
                  C: 'aGVsbG8=',
                },
                { T: 'CutterDefaultInternalVariant', X: 2, Y: 3, R: 1 },
              ],
            },
          },
          {
            T: 'Layout_2',
            X: 3,
            Y: -4,
            R: 2,
            B: {
              $type: 'Building',
              Icon: { Data: [] },
              Entries: [
                { T: 'BeltDefaultForwardInternalVariant', X: 0, Y: 0 },
                { T: 'BeltDefaultForwardInternalVariant', X: 1, Y: 0 },
              ],
            },
          },
          {
            T: 'Layout_3_L',
            X: 5,
            Y: 6,
            R: 3,
            B: { $type: 'Building', Icon: { Data: [] }, Entries: [] },
          },
          { T: 'Layout_1', X: -7, Y: 8 },
        ],
      },
    },
  },
};

export const createBlueprintCodecFixture = (
  kind: keyof typeof blueprintCodecFixtures,
) => structuredClone(blueprintCodecFixtures[kind]);

export const corruptBlueprintIdentifiers = [
  { name: 'invalid base64', identifier: 'SHAPEZ2-1-!$' },
  { name: 'non-gzip bytes', identifier: 'SHAPEZ2-1-bm90LWd6aXA=$' },
  {
    name: 'damaged gzip checksum',
    identifier:
      'SHAPEZ2-1-H4sIAAAAAAAC/5XOPwvCMBCH4e/ywzGC1fov4NJWpeAgIkURh9NGDZQoaYJIyXc3Rt1c5LY73odrUIBHnXHMkCzBG7TM4ybAkVhZlVKdwZAfr+p1ysgQ+A71hW6Cp/Y92DuGqTJaitpfG6xftahMJk5kKzO76jvpMldGaEVVQVqSMp7dgLe7DFvwHsPCf8GwAveb1AM0L+rDfDSBY3+JcQDb/SB2gxh9idQaX3yQn/Ug1MOQ9dzeuSdaTCI6HwEAAA==$',
  },
  {
    name: 'invalid JSON',
    identifier: 'SHAPEZ2-1-H4sIAAAAAAAC/6sGADlH1RUBAAAA$',
  },
] satisfies Array<{ name: string; identifier: BlueprintIdentifier }>;
