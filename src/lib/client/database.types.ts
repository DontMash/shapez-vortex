
export type Database<T, U> = {
    has: (identifier: T) => Promise<boolean>;
    get: (identifier: T) => Promise<U>;
    getAll: () => Promise<Array<U>>;
    add: (data: U) => Promise<T>;
    update: (data: U) => Promise<T>;
    remove: (identifier: T) => Promise<void>;
};
