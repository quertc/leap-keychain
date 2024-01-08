import { WalletOptions } from '../types/wallet';
import * as bytes from '@ethersproject/bytes';
import { StdSignDoc } from '../types/tx';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare class EthWallet {
    private mnemonic;
    private pvtKey;
    private walletType;
    private options;
    private constructor();
    /**
     * Generates a wallet from a mnemonic. Returns an EthWallet object.
     * @param mnemonic The mnemonic to generate a wallet from
     * @param options WalletOptions object
     */
    static generateWalletFromMnemonic(mnemonic: string, options: WalletOptions): EthWallet;
    /**
     * Generates a wallet from a private key.
     * @param {string} pvtKey - The private key to generate the wallet from.
     * @param {WalletOptions} options - The options for the wallet.
     * @returns {EthWallet} A wallet object.
     */
    static generateWalletFromPvtKey(pvtKey: string, options: WalletOptions): EthWallet;
    getAccounts(): {
        algo: string;
        address: string;
        pubkey: Uint8Array;
    }[];
    private getAccountsWithPrivKey;
    sign(signerAddress: string, signBytes: string | Uint8Array): bytes.Signature;
    signMessage(signerAddress: string, message: Uint8Array): Promise<string>;
    signTransaction(signerAddress: string, transaction: any): Promise<string>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): {
        signed: StdSignDoc;
        signature: import("..").StdSignature;
    };
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<{
        signed: SignDoc;
        signature: import("..").StdSignature;
    }>;
}
