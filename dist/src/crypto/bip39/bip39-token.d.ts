import { Token } from 'typedi';
export interface IBip39 {
    generateMnemonic(strength: number): string;
    mnemonicToSeed(mnemonic: string): Promise<Uint8Array>;
    validateMnemonic(mnemonic: string): boolean;
    mnemonicToSeedSync(mnemonic: string): Uint8Array;
    mnemonicToEntropy(mnemonic: string): string;
}
export declare const bip39Token: Token<IBip39>;
export declare function setBip39(bip39: IBip39): void;
export declare function getBip39(): IBip39;
