import Container, { Token } from 'typedi';
export const storageToken = new Token('storage');
/**
 * Initialize storage layer.
 * @param storageLayer
 */
export function initStorage(storageLayer) {
    Container.set(storageToken, storageLayer);
}
