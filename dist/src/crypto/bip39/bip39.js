import * as bip39 from 'bip39';
export var Bip39;
(function (Bip39) {
    function generateMnemonic(strength) {
        return bip39.generateMnemonic(strength);
    }
    Bip39.generateMnemonic = generateMnemonic;
    function mnemonicToSeed(mnemonic) {
        return bip39.mnemonicToSeed(mnemonic);
    }
    Bip39.mnemonicToSeed = mnemonicToSeed;
    function validateMnemonic(mnemonic) {
        return bip39.validateMnemonic(mnemonic);
    }
    Bip39.validateMnemonic = validateMnemonic;
    function mnemonicToSeedSync(mnemonic) {
        return bip39.mnemonicToSeedSync(mnemonic);
    }
    Bip39.mnemonicToSeedSync = mnemonicToSeedSync;
    function mnemonicToEntropy(mnemonic) {
        return bip39.mnemonicToEntropy(mnemonic);
    }
    Bip39.mnemonicToEntropy = mnemonicToEntropy;
})(Bip39 || (Bip39 = {}));
