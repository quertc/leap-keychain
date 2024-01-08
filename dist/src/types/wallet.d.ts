import { EthWallet } from '../key/eth-wallet';
import { PvtKeyWallet, Wallet } from '../key/wallet';
export declare type WalletOptions = {
    paths: string[];
    addressPrefix: string;
};
export declare type LeapSigner = EthWallet | Wallet | PvtKeyWallet;
