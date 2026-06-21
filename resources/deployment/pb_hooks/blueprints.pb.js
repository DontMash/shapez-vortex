/// <reference path="../pb_data/types.d.ts" />

onRecordUpdateRequest((e) => {
  const auth = e.requestInfo().auth;
  if (!auth) {
    throw new UnauthorizedError('Authentication required');
  }

  const record = e.record;
  const original = record.original();
  const creator = original.get('creator');

  if (auth.id === creator) {
    e.next();
    return;
  }

  if (!auth.get('verified')) {
    throw new ForbiddenError('Account must be verified');
  }

  const allowed = ['viewCount', 'downloadCount', 'bookmarkCount'];
  const system = ['id', 'collectionId', 'collectionName', 'created', 'updated'];

  for (const key of Object.keys(record.publicExport())) {
    if (system.includes(key) || !record.has(key)) continue;
    if (!allowed.includes(key)) {
      throw new ForbiddenError(`Field "${key}" cannot be updated`);
    }
  }

  for (const key of allowed) {
    if (!record.has(key)) continue;
    const oldVal = original.get(key) ?? 0;
    const newVal = record.get(key);
    if (typeof newVal !== 'number' || !Number.isInteger(newVal)) {
      throw new BadRequestError(`${key} must be an integer`);
    }
    if (newVal - oldVal !== 1) {
      throw new BadRequestError(`${key} can only increment by 1`);
    }
  }

  e.next();
}, 'blueprints');
