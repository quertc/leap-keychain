import { StdSignDoc } from '../types/tx';
import { WalletOptions } from '../types/wallet';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare function pubkeyToAddress(prefix: string, publicKey: Uint8Array): string;
export declare class Wallet {
    private wallet;
    private options;
    private constructor();
    static generateWallet(mnemonic: string, options: WalletOptions): Wallet;
    signAmino(signerAddress: string, signDoc: StdSignDoc, signOptions?: {
        extraEntropy: boolean;
    }): Promise<{
        signed: StdSignDoc;
        signature: import("..").StdSignature;
    }>;
    signDirect(signerAddress: string, signDoc: SignDoc, signOptions?: {
        extraEntropy?: boolean;
    }): Promise<{
        signed: SignDoc;
        signature: import("..").StdSignature;
    }>;
    getAccounts(): {
        algo: string;
        address: string;
        pubkey: Uint8Array | null;
    }[];
    getAccountsWithPrivKey(): {
        algo: string;
        address: string;
        pubkey: Uint8Array | null;
        childKey: import("../crypto/bip32/hdwallet-token").IChildKey;
    }[];
}
export declare class PvtKeyWallet {
    private privateKey;
    private publicKey;
    private address;
    constructor(privateKey: Uint8Array, publicKey: Uint8Array, address: string);
    static generateWallet(privateKey: string, addressPrefix: string): PvtKeyWallet;
    getAccounts(): {
        algo: string;
        address: string;
        pubkey: Uint8Array;
    }[];
    signAmino(signerAddress: string, signDoc: StdSignDoc, signOptions?: {
        extraEntropy?: boolean;
    }): Promise<{
        signed: StdSignDoc;
        signature: import("..").StdSignature;
    }>;
    signDirect(signerAddress: string, signDoc: SignDoc, signOptions?: {
        extraEntropy?: boolean;
    }): Promise<{
        signed: SignDoc;
        signature: import("..").StdSignature;
    }>;
}
