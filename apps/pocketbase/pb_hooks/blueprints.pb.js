/// <reference path="../pb_data/types.d.ts" />

onRecordUpdateRequest((e) => {
  const auth = e.requestInfo().auth;
  if (!auth) {
    throw new UnauthorizedError('Authentication required');
  }

  const record = e.record;
  if (!record) {
    throw new BadRequestError('Undefined record');
  }

  const original = record.original();
  const creator = original.get('creator');
  if (auth.id === creator) {
    e.next();
    return;
  }

  const incrementOnly = new Set(['viewCount', 'downloadCount']);
  const allowed = [...incrementOnly, 'bookmarkCount'];
  const system = ['id', 'collectionId', 'collectionName', 'created', 'updated'];
  const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  for (const key of Object.keys(record.publicExport())) {
    if (system.includes(key) || allowed.includes(key)) continue;
    const newVal = record.get(key);
    const oldVal = original.get(key);
    if (equals(newVal, oldVal)) continue;
    throw new ForbiddenError(`Field "${key}" cannot be updated`);
  }

  for (const key of allowed) {
    const newVal = record.get(key);
    const oldVal = original.get(key) ?? 0;
    if (equals(newVal, oldVal)) continue;
    if (typeof newVal !== 'number' || !Number.isInteger(newVal)) {
      throw new BadRequestError(`${key} must be an integer`);
    }
    const diff = newVal - oldVal;
    if (incrementOnly.has(key) && diff !== 1) {
      throw new BadRequestError(`${key} can only increment by 1`);
    }
    if (!incrementOnly.has(key) && Math.abs(diff) !== 1) {
      throw new BadRequestError(`${key} can only change by ±1`);
    }
  }

  e.next();
}, 'blueprints');
