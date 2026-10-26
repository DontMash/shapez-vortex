import type PocketBase from 'pocketbase';

type FakeRecord = Record<string, unknown> & {
  id: string;
  collectionName: string;
  created: string;
  updated: string;
};

interface FakeListResult {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: FakeRecord[];
}

interface FakeCollection {
  create(data: Record<string, unknown> | FormData): Promise<FakeRecord>;
  getList(
    page: number,
    perPage: number,
    options?: { filter?: string; sort?: string },
  ): Promise<FakeListResult>;
  getFullList(options?: { filter?: string }): Promise<FakeRecord[]>;
  getOne(id: string): Promise<FakeRecord>;
  update(
    id: string,
    data: Record<string, unknown> | FormData,
  ): Promise<FakeRecord>;
  authWithPassword(
    identity: string,
    password: string,
  ): Promise<{ token: string; record: FakeRecord }>;
}

interface FakePocketBaseClient {
  authStore: {
    readonly isValid: boolean;
    readonly model: FakeRecord | null;
    readonly record: FakeRecord | null;
    clear(): void;
    save(token: string, record: FakeRecord): void;
    loadFromCookie(cookie: string): void;
    exportToCookie(): string;
  };
  collection(name: string): FakeCollection;
  createClient(): FakePocketBaseClient;
}

export type FakePocketBase = PocketBase & {
  createClient: () => FakePocketBase;
};

const FILTER_PATTERNS: Array<
  [RegExp, (record: FakeRecord, field: string, value: string) => boolean]
> = [
  [
    /^(\w+)\s*~\s*"(.*)"$/,
    (record, field, value) =>
      String(record[field] ?? '')
        .toLowerCase()
        .includes(value.toLowerCase()),
  ],
  [
    /^(\w+)\?~\s*"(.*)"$/,
    (record, field, value) => {
      const fieldValue = record[field];
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return String(fieldValue ?? '') === value;
    },
  ],
  [
    /^(\w+)\s*=\s*"(.*)"$/,
    (record, field, value) => String(record[field] ?? '') === value,
  ],
];

export const createFakePocketBase = (): FakePocketBase => {
  const collections = new Map<string, Map<string, FakeRecord>>();

  const getCollection = (name: string): Map<string, FakeRecord> => {
    if (!collections.has(name)) {
      collections.set(name, new Map());
    }
    return collections.get(name)!;
  };

  const generateId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 15; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  };

  const coerceValue = (value: unknown): unknown => {
    if (
      typeof value === 'string' &&
      value.trim() !== '' &&
      !isNaN(Number(value))
    ) {
      return Number(value);
    }
    return value;
  };

  const formDataToObject = (data: FormData): Record<string, unknown> => {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of data.entries()) {
      const coerced = coerceValue(value);
      if (key in obj) {
        const existing = obj[key];
        if (Array.isArray(existing)) {
          existing.push(coerced);
        } else {
          obj[key] = [existing, coerced];
        }
      } else {
        obj[key] = coerced;
      }
    }
    return obj;
  };

  const toRecordData = (
    data: Record<string, unknown> | FormData,
  ): Record<string, unknown> =>
    data instanceof FormData ? formDataToObject(data) : { ...data };

  const applyUpdate = (
    existing: FakeRecord,
    data: Record<string, unknown> | FormData,
  ): FakeRecord => {
    const updates = toRecordData(data);
    const result = { ...existing };
    for (const [key, value] of Object.entries(updates)) {
      if (key.endsWith('+')) {
        const field = key.slice(0, -1);
        const arr = Array.isArray(result[field])
          ? (result[field] as unknown[])
          : [];
        result[field] = [...arr, value];
      } else if (key.endsWith('-')) {
        const field = key.slice(0, -1);
        const arr = Array.isArray(result[field])
          ? (result[field] as unknown[])
          : [];
        result[field] = arr.filter((v) => v !== value);
      } else {
        result[key] = value;
      }
    }
    result.updated = new Date().toISOString();
    return result;
  };

  const matchesCondition = (record: FakeRecord, condition: string): boolean => {
    for (const [regex, compare] of FILTER_PATTERNS) {
      const match = condition.match(regex);
      if (match) {
        return compare(record, match[1], match[2]);
      }
    }
    throw new Error(`Unsupported filter condition: "${condition}"`);
  };

  const matchesFilter = (record: FakeRecord, filter: string): boolean => {
    const orGroups = filter.split('||').map((g) => g.trim());
    return orGroups.some((group) => {
      const andConditions = group.split('&&').map((c) => c.trim());
      return andConditions.every((condition) =>
        matchesCondition(record, condition),
      );
    });
  };

  const filterRecords = (items: FakeRecord[], filter?: string): FakeRecord[] =>
    filter ? items.filter((record) => matchesFilter(record, filter)) : items;

  const applySort = (records: FakeRecord[], sort: string): FakeRecord[] => {
    const sortFields = sort.split(',').map((s) => s.trim());
    return [...records].sort((a, b) => {
      for (const field of sortFields) {
        const desc = field.startsWith('-');
        const fieldName = desc ? field.slice(1) : field;
        const aVal = a[fieldName];
        const bVal = b[fieldName];
        if (aVal === bVal) continue;
        const comparison = String(aVal ?? '') < String(bVal ?? '') ? -1 : 1;
        return desc ? -comparison : comparison;
      }
      return 0;
    });
  };

  const createClient = (): FakePocketBaseClient => {
    let currentAuth: FakeRecord | null = null;

    const collection = (name: string): FakeCollection => {
      const records = getCollection(name);
      return {
        async create(data) {
          const obj = toRecordData(data);
          const now = new Date().toISOString();
          const record = {
            id: generateId(),
            collectionName: name,
            created: now,
            updated: now,
            ...obj,
          } as FakeRecord;
          records.set(record.id, record);
          return record;
        },

        async getList(page, perPage, options) {
          let items = filterRecords([...records.values()], options?.filter);
          if (options?.sort) {
            items = applySort(items, options.sort);
          }
          const totalItems = items.length;
          const totalPages = Math.ceil(totalItems / perPage);
          const start = (page - 1) * perPage;
          items = items.slice(start, start + perPage);
          return { page, perPage, totalItems, totalPages, items };
        },

        async getFullList(options) {
          return filterRecords([...records.values()], options?.filter);
        },

        async getOne(id) {
          const record = records.get(id);
          if (!record) {
            throw new Error(`Record not found: ${name}/${id}`);
          }
          return record;
        },

        async update(id, data) {
          const existing = records.get(id);
          if (!existing) {
            throw new Error(`Record not found: ${name}/${id}`);
          }
          const updated = applyUpdate(existing, data);
          records.set(id, updated);
          return updated;
        },

        async authWithPassword(identity, password) {
          const users = getCollection('users');
          const user = [...users.values()].find(
            (u) => u.username === identity && u.password === password,
          );
          if (!user) {
            throw new Error('Failed to authenticate.');
          }
          currentAuth = user;
          return { token: 'fake-token', record: user };
        },
      };
    };

    const client = {
      authStore: {
        get isValid() {
          return currentAuth !== null;
        },
        get model() {
          return currentAuth;
        },
        get record() {
          return currentAuth;
        },
        clear() {
          currentAuth = null;
        },
        save(_token: string, record: FakeRecord) {
          currentAuth = record;
        },
        loadFromCookie() {},
        exportToCookie() {
          return '';
        },
      },
      collection,
    };
    return Object.assign(client, { createClient });
  };

  return createClient() as unknown as FakePocketBase;
};
