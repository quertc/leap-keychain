export declare type AminoMsg = {
    type: string;
    value: any;
};
export declare type Coin = {
    denom: string;
    amount: string;
};
export declare type StdFee = {
    readonly amount: readonly Coin[];
    readonly gas: string;
    readonly granter?: string;
};
export declare type StdSignDoc = {
    readonly chain_id: string;
    readonly account_number: string;
    readonly sequence: string;
    readonly fee: StdFee;
    readonly msgs: readonly AminoMsg[];
    readonly memo: string;
};
export declare type SignDoc = {
    bodyBytes: Uint8Array;
    authInfoBytes: Uint8Array;
    chainId: string;
    accountNumber: string;
};
