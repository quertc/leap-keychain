import Container, { Token } from 'typedi';
export const bip39Token = new Token('bip39');
export function setBip39(bip39) {
    Container.set(bip39Token, bip39);
}
export function getBip39() {
    return Container.get(bip39Token);
}
