import { Token } from 'typedi';
export declare type IHDKey = {
    derive: (path: string) => IChildKey;
    publicKey: Uint8Array | null;
    privateKey: Uint8Array | null;
};
export declare type IChildKey = {
    publicKey: Uint8Array | null;
    privateKey: Uint8Array | null;
    sign: (hash: Uint8Array) => Uint8Array;
};
export interface IBip32 {
    derivePath(key: IHDKey, path: string): IChildKey;
    fromSeed(seed: Uint8Array): IHDKey;
    sign(key: IChildKey, hash: Uint8Array): Uint8Array;
}
export declare const bip32Token: Token<IBip32>;
export declare function setBip32(bip32: IBip32): void;
export declare function getBip32(): IBip32;
