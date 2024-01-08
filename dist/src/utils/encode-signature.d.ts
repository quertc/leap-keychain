import { Pubkey, StdSignature } from '../types/signature';
export declare function encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature;
export declare function encodeSecp256k1Pubkey(pubkey: Uint8Array): Pubkey;
