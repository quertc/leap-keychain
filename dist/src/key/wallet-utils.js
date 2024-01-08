import Container from 'typedi';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
import { EthWallet } from './eth-wallet';
import { Wallet } from './wallet';
import * as base64js from 'base64-js';
import { bip39Token } from '../crypto/bip39/bip39-token';
export function generateWalletFromMnemonic(mnemonic, hdPath, addressPrefix) {
    const bip39 = Container.get(bip39Token);
    bip39.mnemonicToEntropy(mnemonic);
    const hdPathParams = hdPath.split('/');
    const coinType = hdPathParams[2];
    if ((coinType === null || coinType === void 0 ? void 0 : coinType.replace("'", '')) === '60') {
        return EthWallet.generateWalletFromMnemonic(mnemonic, { paths: [hdPath], addressPrefix });
    }
    return Wallet.generateWallet(mnemonic, { paths: [hdPath], addressPrefix });
}
export function generateWalletsFromMnemonic(mnemonic, paths, prefix) {
    const bip39 = Container.get(bip39Token);
    bip39.mnemonicToEntropy(mnemonic);
    const coinTypes = paths.map((hdPath) => {
        var _a;
        const pathParams = hdPath.split('/');
        return (_a = pathParams[2]) === null || _a === void 0 ? void 0 : _a.replace("'", '');
    });
    const refCoinType = coinTypes[0];
    const isValid = coinTypes.every((coinType) => coinType === refCoinType);
    if (!isValid) {
        throw new Error('All paths must have the same coin type');
    }
    if (refCoinType === '60') {
        return EthWallet.generateWalletFromMnemonic(mnemonic, { paths, addressPrefix: prefix });
    }
    return Wallet.generateWallet(mnemonic, { paths, addressPrefix: prefix });
}
export function compressedPublicKey(publicKey) {
    const secp256k1 = Container.get(secp256k1Token);
    return base64js.fromByteArray(secp256k1.publicKeyConvert(publicKey, true));
}
