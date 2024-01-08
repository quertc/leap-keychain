import Container, { Token } from 'typedi';
export const bip32Token = new Token('bip32');
export function setBip32(bip32) {
    Container.set(bip32Token, bip32);
}
export function getBip32() {
    return Container.get(bip32Token);
}
