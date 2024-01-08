import { Token } from 'typedi';
export declare type StorageLayer = {
    /**
     * @description Get the keystore from the storage
     * @param key
     */
    get: <T = string>(key: string) => Promise<T>;
    /**
     * @description Set the keystore to the storage
     * @param key
     * @param value
     */
    set: <T = string>(key: string, value: T) => Promise<void>;
    /**
     * @description Remove the keystore from the storage
     * @param key
     */
    remove: (key: string) => Promise<void>;
};
export declare const storageToken: Token<StorageLayer>;
/**
 * Initialize storage layer.
 * @param storageLayer
 */
export declare function initStorage(storageLayer: StorageLayer): void;
