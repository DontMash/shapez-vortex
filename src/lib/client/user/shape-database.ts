import type { Database } from '$lib/client/database.types';
import type { ShapeData, ShapeIdentifier } from '$lib/shape.types';

export const DATABASE_SHAPE_STORE_NAME = 'shapes';

export type UserShapeDatabase = Database<ShapeIdentifier, ShapeData>;

export function has(db: IDBDatabase): UserShapeDatabase['has'] {
    return (identifier: ShapeIdentifier) => new Promise<boolean>((resolve, reject) => {
        const hasTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readonly');
        hasTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot has shape', { cause: event }));
        hasTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot has shape', { cause: event }));

        const blueprintStore = hasTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
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

export function get(db: IDBDatabase): UserShapeDatabase['get'] {
    return (identifier: ShapeIdentifier) => new Promise<ShapeData>((resolve, reject) => {
        const getTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readonly');
        getTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot get shape', { cause: event }));
        getTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot get shape', { cause: event }));

        const blueprintStore = getTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
        const getRequest = blueprintStore.get(identifier);
        getRequest.onerror = (event) => {
            return reject(new Error('Database store get error', { cause: event }));
        };
        getRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<ShapeData>;
            return resolve(request.result);
        };
    });
}

export function getAll(db: IDBDatabase): UserShapeDatabase['getAll'] {
    return () => new Promise<Array<ShapeData>>((resolve, reject) => {
        const getAllTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readonly');
        getAllTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot getAll shape', { cause: event }));
        getAllTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot getAll shape', { cause: event }));

        const blueprintStore = getAllTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
        const getAllRequest = blueprintStore.getAll();
        getAllRequest.onerror = (event) => {
            return reject(new Error('Database store getAll error', { cause: event }));
        };
        getAllRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<Array<ShapeData>>;
            return resolve(request.result);
        };
    });
}

export function add(db: IDBDatabase): UserShapeDatabase['add'] {
    return (data: ShapeData) => new Promise<ShapeIdentifier>((resolve, reject) => {
        const addTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readwrite');
        addTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot add shape', { cause: event }));
        addTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot add shape', { cause: event }));

        const blueprintStore = addTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
        const addRequest = blueprintStore.add(data);
        addRequest.onerror = (event) => reject(new Error('Database store add error', { cause: event }));
        addRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<IDBValidKey>;
            return resolve(request.result as ShapeIdentifier);
        };
    });
}

export function update(db: IDBDatabase): UserShapeDatabase['update'] {
    return (data: ShapeData) => new Promise<ShapeIdentifier>((resolve, reject) => {
        const putTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readwrite');
        putTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot put shape', { cause: event }));
        putTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot put shape', { cause: event }));

        const blueprintStore = putTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
        const putRequest = blueprintStore.put(data);
        putRequest.onerror = (event) => reject(new Error('Database store put error', { cause: event }));
        putRequest.onsuccess = (event) => {
            const request = event.target as IDBRequest<IDBValidKey>;
            return resolve(request.result as ShapeIdentifier);
        };
    });
}

export function remove(db: IDBDatabase): UserShapeDatabase['remove'] {
    return (identifier: ShapeIdentifier) => new Promise<void>((resolve, reject) => {
        const deleteTransaction = db.transaction([DATABASE_SHAPE_STORE_NAME], 'readwrite');
        deleteTransaction.onerror = (event) => reject(new Error('Database transaction error - cannot remove shape', { cause: event }));
        deleteTransaction.onabort = (event) => reject(new Error('Database transaction abort - cannot remove shape', { cause: event }));

        const blueprintStore = deleteTransaction.objectStore(DATABASE_SHAPE_STORE_NAME);
        const deleteRequest = blueprintStore.delete(identifier);
        deleteRequest.onerror = (event) => reject(new Error('Database store remove error', { cause: event }));
        deleteRequest.onsuccess = () => resolve();
    });
}
