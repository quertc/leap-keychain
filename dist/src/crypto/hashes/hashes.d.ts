import { Token } from 'typedi';
declare type ripemd160 = (message: Uint8Array | string) => Uint8Array;
declare type sha256 = (message: Uint8Array | string) => Uint8Array;
export declare const ripemd160Token: Token<ripemd160>;
export declare const sha256Token: Token<sha256>;
export declare const setripemd160: (ripemd160: ripemd160) => void;
export declare const setsha256: (sha256: sha256) => void;
export {};
