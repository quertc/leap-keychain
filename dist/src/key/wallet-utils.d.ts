import { EthWallet } from './eth-wallet';
import { Wallet } from './wallet';
export declare function generateWalletFromMnemonic(mnemonic: string, hdPath: string, addressPrefix: string): EthWallet | Wallet;
export declare function generateWalletsFromMnemonic(mnemonic: string, paths: string[], prefix: string): Wallet | EthWallet;
export declare function compressedPublicKey(publicKey: Uint8Array): string;
