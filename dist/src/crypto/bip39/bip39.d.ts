export declare namespace Bip39 {
    function generateMnemonic(strength: number): string;
    function mnemonicToSeed(mnemonic: string): Promise<Uint8Array>;
    function validateMnemonic(mnemonic: string): boolean;
    function mnemonicToSeedSync(mnemonic: string): Uint8Array;
    function mnemonicToEntropy(mnemonic: string): string;
}
