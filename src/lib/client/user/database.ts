import {
    add as addBlueprint,
    getAll as getAllBlueprints,
    get as getBlueprint,
    has as hasBlueprint,
    remove as removeBlueprint,
    update as updateBlueprint,
    type UserBlueprintDatabase
} from '$lib/client/user/blueprints-database';

const DATABASE_NAME = 'user_data';
const DATABASE_VERSION = 1;

export const DATABASE_BLUEPRINT_STORE_NAME = 'blueprints';

export type UserDatabase = {
    blueprint: UserBlueprintDatabase;
    dispose: () => void;
};

export function create(): Promise<UserDatabase> {
    let db: IDBDatabase | undefined;

    return new Promise<UserDatabase>((resolve, reject) => {
        const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        openRequest.onerror = () => reject(new Error(`Database not available - cannot open database ${DATABASE_NAME}@${DATABASE_VERSION}`));
        openRequest.onblocked = () => reject(new Error(`Database not available - cannot open database ${DATABASE_NAME}@${DATABASE_VERSION} (blocked)`));
        openRequest.onupgradeneeded = (event) => {
            const upgradeEvent = event as IDBVersionChangeEvent;
            const request = upgradeEvent.target as IDBOpenDBRequest;
            const db = request.result;
            upgrade(db);
        };
        openRequest.onsuccess = (event) => {
            const upgradeEvent = event as IDBVersionChangeEvent;
            const request = upgradeEvent.target as IDBOpenDBRequest;
            db = request.result;
            return resolve({
                blueprint: {
                    has: hasBlueprint(db),
                    get: getBlueprint(db),
                    getAll: getAllBlueprints(db),
                    add: addBlueprint(db),
                    update: updateBlueprint(db),
                    remove: removeBlueprint(db),
                },
                dispose: dispose(db),
            });
        };
    });
}

function upgrade(db: IDBDatabase) {
    db.createObjectStore(DATABASE_BLUEPRINT_STORE_NAME, { keyPath: 'identifier', autoIncrement: true });
}

function dispose(db: IDBDatabase) {
    return () => db.close();
}
