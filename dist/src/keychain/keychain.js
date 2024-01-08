var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EthWallet } from '../key/eth-wallet';
import getHDPath from '../utils/get-hdpath';
import { PvtKeyWallet } from '../key/wallet';
import { Container } from 'typedi';
import { decrypt, encrypt } from '../encryption-utils/encryption-utils';
import { storageToken } from '../storage/storage-layer';
import { v4 as uuidv4 } from 'uuid';
import { correctMnemonic } from '../utils/correct-mnemonic';
import { WALLETTYPE } from '../types/keychain';
import { compressedPublicKey, generateWalletFromMnemonic, generateWalletsFromMnemonic } from '../key/wallet-utils';
import { Wallet } from '../key/wallet';
export const KEYCHAIN = 'keystore';
export const ENCRYPTED_KEYCHAIN = 'encrypted-keystore';
export const ACTIVE_WALLET = 'active-wallet';
export const ENCRYPTED_ACTIVE_WALLET = 'encrypted-active-wallet';
export class KeyChain {
    static createWalletUsingMnemonic({ name, mnemonic, password, addressIndex, colorIndex, chainInfos, type, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const allWallets = (_a = (yield KeyChain.getAllWallets())) !== null && _a !== void 0 ? _a : {};
            const walletsData = Object.values(allWallets);
            const { addresses, pubKeys } = yield KeyChain.getAddresses(mnemonic, addressIndex, chainInfos);
            const walletId = uuidv4();
            if (KeyChain.isWalletAlreadyPresent((_b = Object.values(addresses)[0]) !== null && _b !== void 0 ? _b : '', walletsData)) {
                throw new Error('Wallet already present');
            }
            const wallet = {
                addressIndex: addressIndex,
                name: name,
                cipher: encrypt(mnemonic, password),
                addresses,
                pubKeys,
                walletType: type === 'create' ? WALLETTYPE.SEED_PHRASE : WALLETTYPE.SEED_PHRASE_IMPORTED,
                id: walletId,
                colorIndex: colorIndex,
            };
            yield KeyChain.updateKeyChain({
                [walletId]: wallet,
            });
            return wallet;
        });
    }
    static createNewWalletAccount(name, password, colorIndex, chainInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallets = yield KeyChain.getAllWallets();
            const walletsData = Object.values(wallets);
            const lastIndex = walletsData
                .filter((wallet) => wallet.walletType === WALLETTYPE.SEED_PHRASE)
                .reduce((prevVal, currentValue) => {
                if (prevVal > currentValue.addressIndex) {
                    return prevVal;
                }
                return currentValue.addressIndex;
            }, 0);
            const addressIndex = lastIndex + 1;
            const primaryWallet = walletsData.find((wallet) => wallet.walletType === WALLETTYPE.SEED_PHRASE);
            if (!primaryWallet) {
                throw new Error('No primary wallet found');
            }
            const cipher = primaryWallet.cipher;
            const mnemonic = decrypt(cipher, password);
            const { addresses, pubKeys } = yield KeyChain.getAddresses(mnemonic, addressIndex, chainInfos);
            const walletId = uuidv4();
            const wallet = {
                addressIndex,
                name,
                addresses,
                pubKeys,
                cipher,
                walletType: WALLETTYPE.SEED_PHRASE,
                id: walletId,
                colorIndex: colorIndex !== null && colorIndex !== void 0 ? colorIndex : addressIndex,
            };
            const keystoreEntry = {
                [walletId]: wallet,
            };
            yield KeyChain.updateKeyChain(keystoreEntry);
            return wallet;
        });
    }
    static importNewWallet(privateKey, password, chainInfos, addressIndex, name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = {};
            const pubKeys = {};
            for (const chainInfo of chainInfos) {
                const wallet = chainInfo.coinType === '60'
                    ? EthWallet.generateWalletFromPvtKey(privateKey, {
                        paths: [getHDPath('60', '0')],
                        addressPrefix: chainInfo.addressPrefix,
                    })
                    : yield PvtKeyWallet.generateWallet(privateKey, chainInfo.addressPrefix);
                const [account] = yield wallet.getAccounts();
                if (account) {
                    addresses[chainInfo.key] = account.address;
                    pubKeys[chainInfo.key] = compressedPublicKey(account.pubkey);
                }
            }
            const allWallets = yield KeyChain.getAllWallets();
            const walletsData = Object.values(allWallets !== null && allWallets !== void 0 ? allWallets : {});
            const lastIndex = walletsData.length;
            if (KeyChain.isWalletAlreadyPresent((_a = Object.values(addresses)[0]) !== null && _a !== void 0 ? _a : '', walletsData)) {
                throw new Error('Wallet already present');
            }
            const walletId = uuidv4();
            const wallet = {
                [walletId]: {
                    // address index is not relevant in case of wallets imported using private key.
                    addressIndex: addressIndex !== null && addressIndex !== void 0 ? addressIndex : lastIndex + 1,
                    name: name !== null && name !== void 0 ? name : `Wallet ${lastIndex + 1}`,
                    addresses,
                    pubKeys,
                    cipher: encrypt(privateKey, password),
                    walletType: WALLETTYPE.PRIVATE_KEY,
                    id: walletId,
                    colorIndex: lastIndex,
                },
            };
            KeyChain.updateKeyChain(wallet);
            return wallet[walletId];
        });
    }
    static EditWallet({ walletId, name, colorIndex, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const keyStore = (yield storage.get(KEYCHAIN));
            const wallet = keyStore[walletId];
            if (!wallet) {
                throw new Error('Wallet not found');
            }
            const otherWallet = Object.values(keyStore).find((v) => v.name === name && v.id !== wallet.id);
            if (otherWallet) {
                throw new Error('Wallet name already exists');
            }
            wallet.name = name;
            wallet.colorIndex = colorIndex;
            const wallets = {
                [walletId]: wallet,
            };
            yield KeyChain.updateKeyChain(wallets);
        });
    }
    static getWalletsFromMnemonic(mnemonic, count, coinType, addressPrefix, privKeysMode = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctedMnemonic = correctMnemonic(mnemonic);
            const holder = new Array(count).fill(0);
            const hdPaths = holder.map((_, v) => getHDPath(coinType, v.toString()));
            const generatedWallet = yield generateWalletsFromMnemonic(correctedMnemonic, hdPaths, addressPrefix);
            let accounts;
            if (privKeysMode && generatedWallet instanceof Wallet) {
                accounts = generatedWallet
                    .getAccountsWithPrivKey()
                    .map((account, index) => ({ address: account.address, pubkey: account.pubkey, childKey: account.childKey, index }));
            }
            else {
                accounts = generatedWallet
                    .getAccounts()
                    .map((account, index) => ({ address: account.address, pubkey: account.pubkey, index }));
            }
            return accounts.sort((a, b) => a.index - b.index);
        });
    }
    static getAllWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            return (yield storage.get(KEYCHAIN));
        });
    }
    static getSigner(walletId, password, addressPrefix, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const keychain = (yield storage.get(KEYCHAIN));
            const walletData = keychain[walletId];
            if (!walletData)
                throw new Error('Wallet not found');
            const secret = decrypt(walletData.cipher, password);
            if (walletData.walletType !== WALLETTYPE.PRIVATE_KEY &&
                walletData.walletType !== WALLETTYPE.SEED_PHRASE &&
                walletData.walletType !== WALLETTYPE.SEED_PHRASE_IMPORTED) {
                throw new Error('Wallet type not supported');
            }
            if (walletData.walletType === WALLETTYPE.PRIVATE_KEY) {
                if (coinType === '60') {
                    const hdPath = getHDPath(coinType, walletData.addressIndex.toString());
                    return EthWallet.generateWalletFromPvtKey(secret, { paths: [hdPath], addressPrefix });
                }
                return PvtKeyWallet.generateWallet(secret, addressPrefix);
            }
            else {
                const hdPath = getHDPath(coinType, walletData.addressIndex.toString());
                return generateWalletFromMnemonic(secret, hdPath, addressPrefix);
            }
        });
    }
    static removeWallets(keyIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const keychain = (yield storage.get(KEYCHAIN));
            keyIds.forEach((keyId) => {
                delete keychain[keyId];
            });
            storage.set(KEYCHAIN, keychain);
        });
    }
    static encrypt(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const keychain = (yield storage.get(KEYCHAIN));
            const activeWallet = (yield storage.get(ACTIVE_WALLET));
            if (keychain && activeWallet) {
                const keychainJSON = JSON.stringify(keychain);
                const activeWalletJSON = JSON.stringify(activeWallet);
                const encryptedKeychain = encrypt(keychainJSON, password);
                const encryptedActiveWallet = encrypt(activeWalletJSON, password);
                storage.set(ENCRYPTED_KEYCHAIN, encryptedKeychain);
                storage.set(ENCRYPTED_ACTIVE_WALLET, encryptedActiveWallet);
                storage.remove(KEYCHAIN);
                storage.remove(ACTIVE_WALLET);
            }
        });
    }
    static decrypt(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const encryptedKeychain = (yield storage.get(ENCRYPTED_KEYCHAIN));
            const encryptedActiveWallet = (yield storage.get(ENCRYPTED_ACTIVE_WALLET));
            if (encryptedKeychain) {
                const keychain = JSON.parse(decrypt(encryptedKeychain, password));
                storage.set(KEYCHAIN, keychain);
            }
            if (encryptedActiveWallet) {
                const activeWallet = JSON.parse(decrypt(encryptedActiveWallet, password));
                storage.set(ACTIVE_WALLET, activeWallet);
            }
        });
    }
    static getAddresses(mnemonic, addressIndex, chainInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chainsData = chainInfos;
                const addresses = {};
                const pubKeys = {};
                for (const chainInfo of chainsData) {
                    const wallet = generateWalletFromMnemonic(mnemonic, getHDPath(chainInfo.coinType, addressIndex.toString()), chainInfo.addressPrefix);
                    const [account] = wallet.getAccounts();
                    if ((account === null || account === void 0 ? void 0 : account.address) && (account === null || account === void 0 ? void 0 : account.pubkey)) {
                        addresses[chainInfo.key] = account.address;
                        pubKeys[chainInfo.key] = compressedPublicKey(account.pubkey);
                    }
                }
                return { addresses, pubKeys };
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    static isWalletAlreadyPresent(address, wallets) {
        return wallets.find((wallet) => Object.values(wallet.addresses).includes(address)) !== undefined;
    }
    static updateKeyChain(newWallets) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const storage = Container.get(storageToken);
            const keystore = yield storage.get(KEYCHAIN);
            const newKeystore = Object.assign(Object.assign({}, keystore), newWallets);
            const entries = Object.keys(newWallets);
            const lastEntry = (_a = entries.pop()) !== null && _a !== void 0 ? _a : '';
            yield storage.set(KEYCHAIN, newKeystore);
            yield storage.set(ACTIVE_WALLET, newWallets[lastEntry]);
        });
    }
}
