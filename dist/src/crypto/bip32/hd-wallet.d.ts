import { IChildKey, IHDKey } from './hdwallet-token';
export declare namespace Bip32 {
    function derivePath(key: IHDKey, path: string): {
        publicKey: Uint8Array | null;
        privateKey: Uint8Array | null;
        sign: (hash: Uint8Array) => Uint8Array;
    };
    function fromSeed(seed: Uint8Array): IHDKey;
    function sign(key: IChildKey, message: Uint8Array): Uint8Array;
}
