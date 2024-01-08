import { Token } from 'typedi';
export declare namespace Secp256k1 {
    function getPublicKey(privateKey: Uint8Array, compressed: boolean): Uint8Array;
    function sign(message: Uint8Array, privateKey: Uint8Array, options?: {
        canonical: boolean;
        extraEntropy?: true;
    }): Promise<Uint8Array>;
    function publicKeyConvert(publicKey: Uint8Array, compressed: boolean): Uint8Array;
}
export declare const secp256k1Token: Token<typeof Secp256k1>;
export declare const setSecp256k1: (secp256k1: typeof Secp256k1) => void;
