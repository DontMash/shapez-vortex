import type { BlueprintData, BlueprintIdentifier } from '$lib/blueprint.types';
import type { Database } from '$lib/client/database.types';

export const DATABASE_BLUEPRINT_STORE_NAME = 'blueprints';

export type UserBlueprintDatabase = Database<BlueprintIdentifier, BlueprintData>;

export function has(db: IDBDatabase): UserBlueprintDatabase['has'] {
    return (identifier: BlueprintIdentifier) => new Promise<boolean>((resolve, reject) => {
        const hasTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readonly');
        hasTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot has blueprint', { cause: event }));
        hasTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot has blueprint', { cause: event }));

        const blueprintStore = hasTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const hasRequest = blueprintStore.openCursor(identifier);
        hasRequest.onerror = (event) => {
            return reject(new Error('Database store has error', { cause: event }));
        };
        hasRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<IDBCursor>;
            return resolve(!!request.result);
        };
    });
}

export function get(db: IDBDatabase): UserBlueprintDatabase['get'] {
    return (identifier: BlueprintIdentifier) => new Promise<BlueprintData>((resolve, reject) => {
        const getTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readonly');
        getTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot get blueprint', { cause: event }));
        getTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot get blueprint', { cause: event }));

        const blueprintStore = getTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const getRequest = blueprintStore.get(identifier);
        getRequest.onerror = (event) => {
            return reject(new Error('Database store get error', { cause: event }));
        };
        getRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<BlueprintData>;
            return resolve(request.result);
        };
    });
}

export function getAll(db: IDBDatabase): UserBlueprintDatabase['getAll'] {
    return () => new Promise<Array<BlueprintData>>((resolve, reject) => {
        const getAllTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readonly');
        getAllTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot getAll blueprint', { cause: event }));
        getAllTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot getAll blueprint', { cause: event }));

        const blueprintStore = getAllTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const getAllRequest = blueprintStore.getAll();
        getAllRequest.onerror = (event) => {
            return reject(new Error('Database store getAll error', { cause: event }));
        };
        getAllRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<Array<BlueprintData>>;
            return resolve(request.result);
        };
    });
}

export function add(db: IDBDatabase): UserBlueprintDatabase['add'] {
    return (data: BlueprintData) => new Promise<BlueprintIdentifier>((resolve, reject) => {
        const addTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readwrite');
        addTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot add blueprint', { cause: event }));
        addTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot add blueprint', { cause: event }));

        const blueprintStore = addTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const addRequest = blueprintStore.add(data);
        addRequest.onerror = (event) => reject(new Error('Database store add error', { cause: event }));
        addRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<IDBValidKey>;
            return resolve(request.result as BlueprintIdentifier);
        };
    });
}

export function update(db: IDBDatabase): UserBlueprintDatabase['update'] {
    return (data: BlueprintData) => new Promise<BlueprintIdentifier>((resolve, reject) => {
        const putTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readwrite');
        putTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot put blueprint', { cause: event }));
        putTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot put blueprint', { cause: event }));

        const blueprintStore = putTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const putRequest = blueprintStore.put(data);
        putRequest.onerror = (event) => reject(new Error('Database store put error', { cause: event }));
        putRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<IDBValidKey>;
            return resolve(request.result as BlueprintIdentifier);
        };
    });
}

export function remove(db: IDBDatabase): UserBlueprintDatabase['remove'] {
    return (identifier: BlueprintIdentifier) => new Promise<void>((resolve, reject) => {
        const deleteTransaction = db.transaction([DATABASE_BLUEPRINT_STORE_NAME], 'readwrite');
        deleteTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot remove blueprint', { cause: event }));
        deleteTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot remove blueprint', { cause: event }));

        const blueprintStore = deleteTransaction.objectStore(DATABASE_BLUEPRINT_STORE_NAME);
        const deleteRequest = blueprintStore.delete(identifier);
        deleteRequest.onerror = (event) => reject(new Error('Database store remove error', { cause: event }));
        deleteRequest.onsuccess = () => resolve();
    });
}
