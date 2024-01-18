import {
    add as addBlueprint,
    DATABASE_BLUEPRINT_STORE_NAME,
    getAll as getAllBlueprints,
    get as getBlueprint,
    has as hasBlueprint,
    remove as removeBlueprint,
    update as updateBlueprint,
    type UserBlueprintDatabase
} from '$lib/client/user/blueprint-database';
import {
    add as addShape,
    DATABASE_SHAPE_STORE_NAME,
    getAll as getAllShapes,
    get as getShape,
    has as hasShape,
    remove as removeShape,
    update as updateShape,
    type UserShapeDatabase
} from '$lib/client/user/shape-database';

const DATABASE_NAME = 'user_data';
const DATABASE_VERSION = 2;

export type UserDatabase = {
    blueprint: UserBlueprintDatabase;
    shape: UserShapeDatabase;
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
            upgrade(db, upgradeEvent.oldVersion);
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
                shape: {
                    has: hasShape(db),
                    get: getShape(db),
                    getAll: getAllShapes(db),
                    add: addShape(db),
                    update: updateShape(db),
                    remove: removeShape(db),
                },
                dispose: dispose(db),
            });
        };
    });
}

function upgrade(db: IDBDatabase, oldVersion: number) {
    if (oldVersion < 1) {
        db.createObjectStore(DATABASE_BLUEPRINT_STORE_NAME, { keyPath: 'identifier', autoIncrement: true });
    }
    if (oldVersion < 2) {
        db.createObjectStore(DATABASE_SHAPE_STORE_NAME, { keyPath: 'identifier', autoIncrement: true });
    }
}

function dispose(db: IDBDatabase) {
    return () => db.close();
}
