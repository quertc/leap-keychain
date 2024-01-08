import { EthWallet } from '../key/eth-wallet';
import { PvtKeyWallet } from '../key/wallet';
import { ChainInfo, CreateWalletParams, Key, Keystore } from '../types/keychain';
import { Wallet } from '../key/wallet';
export declare const KEYCHAIN = "keystore";
export declare const ENCRYPTED_KEYCHAIN = "encrypted-keystore";
export declare const ACTIVE_WALLET = "active-wallet";
export declare const ENCRYPTED_ACTIVE_WALLET = "encrypted-active-wallet";
export declare class KeyChain {
    static createWalletUsingMnemonic<T extends string>({ name, mnemonic, password, addressIndex, colorIndex, chainInfos, type, }: CreateWalletParams): Promise<Key<T>>;
    static createNewWalletAccount<T extends string>(name: string, password: string, colorIndex: number, chainInfos: ChainInfo[]): Promise<Key<T>>;
    static importNewWallet<T extends string>(privateKey: string, password: string, chainInfos: ChainInfo[], addressIndex?: number, name?: string): Promise<Key<T>>;
    static EditWallet<T extends string>({ walletId, name, colorIndex, }: {
        walletId: string;
        name: string;
        colorIndex: number;
    }): Promise<void>;
    static getWalletsFromMnemonic(mnemonic: string, count: number, coinType: string, addressPrefix: string, privKeysMode?: boolean): Promise<{
        address: string;
        index: number;
        pubkey: Uint8Array | null;
        childKey?: any;
    }[]>;
    static getAllWallets<T extends string>(): Promise<Keystore<T>>;
    static getSigner<T extends string>(walletId: string, password: string, addressPrefix: string, coinType: string): Promise<EthWallet | Wallet | PvtKeyWallet>;
    static removeWallets<T extends string>(keyIds: string[]): Promise<void>;
    static encrypt<T extends string>(password: string): Promise<void>;
    static decrypt(password: string): Promise<void>;
    private static getAddresses;
    private static isWalletAlreadyPresent;
    private static updateKeyChain;
}
