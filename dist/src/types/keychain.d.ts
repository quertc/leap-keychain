export declare enum WALLETTYPE {
    SEED_PHRASE = 0,
    PRIVATE_KEY = 1,
    SEED_PHRASE_IMPORTED = 2,
    LEDGER = 3
}
export declare type Key<T extends string> = {
    addressIndex: number;
    name: string;
    cipher: string;
    addresses: Record<T, string>;
    pubKeys?: Record<T, string>;
    walletType: WALLETTYPE;
    id: string;
    colorIndex: number;
};
export declare type Keystore<T extends string> = Record<string, Key<T>>;
export declare type CreateWalletParams = {
    name: string;
    mnemonic: string;
    password: string;
    addressIndex: number;
    colorIndex: number;
    chainInfos: ChainInfo[];
    type: 'create' | 'import';
};
export declare type ChainInfo = {
    key: string;
    addressPrefix: string;
    coinType: string;
};
