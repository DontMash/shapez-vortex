import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  getColors,
  getLayerCount,
  getPartCount,
  getTypes,
  isDefaultShapeIdentifier,
  isHexShapeIdentifier,
  isShapeIdentifier,
  parse,
  random,
  stringify,
  type ShapeColor,
  type ShapeColorIdentifier,
  type ShapeTypeIdentifier,
} from './index';

describe('default shape identifier', () => {
  it('success', () => {
    const data = 'Cu';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - layer', () => {
    const data = 'CuCuCuCu';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - layers', () => {
    const data = 'CuCuCuCu:RbRbRbRb';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - one of', () => {
    const data = 'Cu';
    const result = isShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('failure - invalid type', () => {
    const data = 'Gu';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid color', () => {
    const data = 'Cx';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid layer', () => {
    const data = 'CuCuCuCuCu';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid layer separator', () => {
    const data = 'CuCuCuCu-Cu';
    const result = isDefaultShapeIdentifier(data);
    expect(result).toBe(false);
  });
});

describe('hex shape identifier', () => {
  it('success', () => {
    const data = 'Fu';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - layer', () => {
    const data = 'FuFuFuFuFuFu';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - layers', () => {
    const data = 'FuFuFuFuFu:GbGbGbGbGbGb';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('success - one of', () => {
    const data = 'Fu';
    const result = isShapeIdentifier(data);
    expect(result).toBe(true);
  });

  it('failure - invalid type', () => {
    const data = 'Cu';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid color', () => {
    const data = 'Fx';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid layer', () => {
    const data = 'FuFuFuFuFuFuFu';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(false);
  });

  it('failure - invalid layer separator', () => {
    const data = 'FuFuFuFuFuFu-Fu';
    const result = isHexShapeIdentifier(data);
    expect(result).toBe(false);
  });
});

describe('parse', () => {
  it('success', () => {
    const data = 'Cu';
    const result = () => parse(data);
    expect(result).not.toThrow();
    expect(result()).toEqual([[{ type: 'C', color: 'u' }]]);
  });

  it('success - empty part', () => {
    const data = '--';
    const result = () => parse(data);
    expect(result).not.toThrow();
    expect(result()).toEqual([[{ type: '-', color: '-' }]]);
  });

  it('success - layers', () => {
    const data = 'Cu:Cu';
    const result = () => parse(data);
    expect(result).not.toThrow();
    expect(result()).toEqual([
      [{ type: 'C', color: 'u' }],
      [{ type: 'C', color: 'u' }],
    ]);
  });

  it('failure - invalid type', () => {
    const data = 'Xu';
    const result = () => parse(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = 'Cx';
    const result = () => parse(data);
    expect(result).toThrow();
  });

  it('failure - invalid layer', () => {
    const data = 'CuCuCuCuCuCuCu';
    const result = () => parse(data);
    expect(result).toThrow();
  });

  it('failure - invalid layer separator', () => {
    const data = 'CuCuCuCuCuCu-Cu';
    const result = () => parse(data);
    expect(result).toThrow();
  });
});

describe('stringify', () => {
  it('success', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = stringify(data);
    expect(result).toBe('Cu');
  });

  it('success - layers', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = stringify(data);
    expect(result).toBe('Cu:Cu');
  });

  it('failure - invalid type', () => {
    const data = [
      [
        {
          type: 'X' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => stringify(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'x' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => stringify(data);
    expect(result).toThrow();
  });
});

describe('random', () => {
  const setMockShapePart = (fn: Mock) => {
    // set random shape type chance
    fn.mockReturnValueOnce(0.1);
    // set random shape type
    fn.mockReturnValueOnce(0.1);
    // set random shape color chance
    fn.mockReturnValueOnce(0.1);
    // set random shape color
    fn.mockReturnValueOnce(0.1);
  };

  beforeEach(() => {
    Math.random = vi.fn(() => 0.1);
  });

  it('success', () => {
    const data = {};
    const result = random(data);
    expect(result).toBe('RgRgRgRg:RgRgRgRg');
  });

  it('success - hex', () => {
    Math.random = vi.fn(() => 0.5);
    const data = {};
    const result = random(data);
    expect(result).toBe('HmHmHmHmHmHm:HmHmHmHmHmHm:HmHmHmHmHmHm:HmHmHmHmHmHm');
  });

  it('success - uncolored', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape parts
    for (let index = 0; index < 16; index++) {
      mockRandom.mockReturnValueOnce(0.1);
      mockRandom.mockReturnValueOnce(0.1);
      // set random for uncolored shape part
      mockRandom.mockReturnValueOnce(0.7);
    }
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('RuRuRuRu:RuRuRuRu');
  });

  it('success - crystal', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape crystal
    mockRandom.mockReturnValueOnce(0.1);
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValue(0.1);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('cgRgRgRg:RgRgRgRg');
  });

  it('success - crystal validate', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // // shift to second layer
    for (let index = 0; index < 4; index++) {
      setMockShapePart(mockRandom);
    }
    // set random for shape crystal
    mockRandom.mockReturnValueOnce(0.1);
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValue(0.1);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('RgRgRgRg:cgRgRgRg');
  });

  it('success - simulate drop', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 4; index++) {
      setMockShapePart(mockRandom);
    }
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    // created shape: --RgRgRg:Rg------
    expect(result).toBe('RgRgRgRg:--------');
  });

  it('success - simulate pin drop', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 3; index++) {
      setMockShapePart(mockRandom);
    }
    mockRandom.mockReturnValueOnce(0.1);
    // set random for pin shape
    mockRandom.mockReturnValueOnce(0.8);
    setMockShapePart(mockRandom);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    // created shape: --RgRgRg:P-Rg----
    expect(result).toBe('P-RgRgRg:--Rg----');
  });

  it('success - simulate drop next', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 5; index++) {
      setMockShapePart(mockRandom);
    }
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('--RgRgRg:RgRg----');
  });

  it('success - simulate drop previous', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 4; index++) {
      setMockShapePart(mockRandom);
    }
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    setMockShapePart(mockRandom);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('--RgRgRg:Rg----Rg');
  });

  it('success - simulate drop opposite', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    setMockShapePart(mockRandom);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 4; index++) {
      setMockShapePart(mockRandom);
    }
    setMockShapePart(mockRandom);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('Rg------:RgRgRgRg');
  });

  it('success - simulate drop layer', () => {
    const mockRandom = vi.fn();
    // set random for shape kind
    mockRandom.mockReturnValueOnce(0.1);
    // set random for shape layers
    mockRandom.mockReturnValueOnce(0.1);
    // set random for empty shape
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    mockRandom.mockReturnValueOnce(0.9);
    // shift to second layer
    for (let index = 0; index < 4; index++) {
      setMockShapePart(mockRandom);
    }
    setMockShapePart(mockRandom);
    Math.random = mockRandom;
    const data = {};
    const result = random(data);
    expect(result).toBe('RgRgRgRg:--------');
  });

  it('success - limit types', () => {
    const data = { types: new Set(['C' as ShapeTypeIdentifier]) };
    const result = random(data);
    expect(result).toBe('CgCgCgCg:CgCgCgCg');
  });

  it('success - limit colors', () => {
    const data = { colors: new Set(['r' as ShapeColor]) };
    const result = random(data);
    expect(result).toBe('RrRrRrRr:RrRrRrRr');
  });

  it('failure - invalid type', () => {
    const data = { types: new Set(['X' as ShapeTypeIdentifier]) };
    const result = () => random(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = { colors: new Set(['x' as ShapeColor]) };
    const result = () => random(data);
    expect(result).toThrow();
  });
});

describe('getTypes', () => {
  it('success', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getTypes(data);
    expect(result).toEqual(new Set(['C']));
  });

  it('success - multiple', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
        {
          type: 'R' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getTypes(data);
    expect(result).toEqual(new Set(['C', 'R']));
  });

  it('success - same', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getTypes(data);
    expect(result).toEqual(new Set(['C']));
  });

  it('success - layer', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
      [
        {
          type: 'R' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getTypes(data);
    expect(result).toEqual(new Set(['C', 'R']));
  });

  it('failure - invalid type', () => {
    const data = [
      [
        {
          type: 'X' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getTypes(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'x' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getTypes(data);
    expect(result).toThrow();
  });
});

describe('getColors', () => {
  it('success', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set(['r']));
  });

  it('success - uncolored', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set());
  });

  it('success - multiple', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'g' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set(['r', 'g']));
  });

  it('success - exclude', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set(['r']));
  });

  it('success - same', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set(['r']));
  });

  it('success - layer', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'r' as ShapeColorIdentifier,
        },
      ],
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'g' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getColors(data);
    expect(result).toEqual(new Set(['r', 'g']));
  });

  it('failure - invalid type', () => {
    const data = [
      [
        {
          type: 'X' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getColors(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'x' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getColors(data);
    expect(result).toThrow();
  });
});

describe('getLayerCount', () => {
  it('success', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getLayerCount(data);
    expect(result).toBe(1);
  });

  it('failure - empty shape', () => {
    const data = [[]];
    const result = () => getLayerCount(data);
    expect(result).toThrow();
  });

  it('failure - invalid type', () => {
    const data = [
      [
        {
          type: 'X' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getLayerCount(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'x' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getLayerCount(data);
    expect(result).toThrow();
  });
});

describe('getPartCount', () => {
  it('success', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getPartCount(data);
    expect(result).toBe(1);
  });

  it('success - single layer', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getPartCount(data);
    expect(result).toBe(2);
  });

  it('success - multiple layer', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getPartCount(data);
    expect(result).toBe(2);
  });

  it('success - ignore empty', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
        {
          type: '-' as ShapeTypeIdentifier,
          color: '-' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = getPartCount(data);
    expect(result).toBe(1);
  });

  it('failure - empty shape', () => {
    const data = [[]];
    const result = () => getPartCount(data);
    expect(result).toThrow();
  });

  it('failure - invalid type', () => {
    const data = [
      [
        {
          type: 'X' as ShapeTypeIdentifier,
          color: 'u' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getPartCount(data);
    expect(result).toThrow();
  });

  it('failure - invalid color', () => {
    const data = [
      [
        {
          type: 'C' as ShapeTypeIdentifier,
          color: 'x' as ShapeColorIdentifier,
        },
      ],
    ];
    const result = () => getLayerCount(data);
    expect(result).toThrow();
  });
});
