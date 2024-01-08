export declare type Pubkey = {
    readonly type: string;
    readonly value: any;
};
export declare type StdSignature = {
    readonly pub_key: Pubkey;
    readonly signature: string;
};
