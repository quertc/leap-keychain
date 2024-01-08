var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Container from 'typedi';
import { Bip32 } from '../src/crypto/bip32/hd-wallet';
import { bip32Token } from '../src/crypto/bip32/hdwallet-token';
import { Bip39 } from '../src/crypto/bip39/bip39';
import { setBip39 } from '../src/crypto/bip39/bip39-token';
import { ripemd160Token, sha256Token } from '../src/crypto/hashes/hashes';
import { Wallet, PvtKeyWallet } from '../src/key/wallet';
import { generateWalletFromMnemonic, generateWalletsFromMnemonic } from '../src/key/wallet-utils';
import { EthWallet } from '../src/key/eth-wallet';
import { chainInfos, mnemonic, referenceWallets } from './mockdata';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
beforeEach(() => {
    setBip39(Bip39);
    Container.set(bip32Token, Bip32);
    Container.set(sha256Token, sha256);
    Container.set(ripemd160Token, ripemd160);
});
describe('generateMnemonic', () => {
    test('generates wallet', () => {
        var _a;
        const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType !== 60);
        for (const [key, chainInfo] of chainData) {
            const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
            const wallet = Wallet.generateWallet(mnemonic, {
                addressPrefix: chainInfo.addressPrefix,
                paths: [path],
            });
            const accounts = wallet.getAccounts();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            expect((_a = accounts[0]) === null || _a === void 0 ? void 0 : _a.address).toBe(referenceWallets.ref1.addresses[key]);
        }
    });
    test('generates eth wallet', () => {
        var _a;
        const chainData = Object.entries(chainInfos).filter(([, chainInfo]) => chainInfo.coinType === 60);
        for (const [key, chainInfo] of chainData) {
            const path = `m/44'/${chainInfo.coinType}'/0'/0/0`;
            const wallet = EthWallet.generateWalletFromMnemonic(mnemonic, {
                addressPrefix: chainInfo.addressPrefix,
                paths: [path],
            });
            const accounts = wallet.getAccounts();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect((_a = accounts[0]) === null || _a === void 0 ? void 0 : _a.address).toBe(referenceWallets.ref1.addresses[key]);
        }
    });
    test('Wallet throws error if mnemonic is invalid', () => {
        expect(() => Wallet.generateWallet('', { paths: ["m/44'/60'/0'/0/0"], addressPrefix: 'cosmos' })).toThrow('Invalid mnemonic');
    });
    test('PvtkeyWallet throws error if pvtKey is invalid', () => {
        expect(() => PvtKeyWallet.generateWallet('', 'cosmos')).toThrow('Invalid private key');
    });
    test('Ethwallet throws error if mnemonic is invalid', () => {
        expect(() => EthWallet.generateWalletFromMnemonic('', { paths: ["m/44'/60'/0'/0/0"], addressPrefix: 'cosmos' })).toThrow('Invalid mnemonic');
    });
    test('Ethwallet throws error if pvtKey is invalid', () => {
        expect(() => EthWallet.generateWalletFromPvtKey('', { paths: ["m/44'/118'/0'/0/0"], addressPrefix: 'cosmos' })).toThrow('Invalid private key');
    });
    test('generateWalletFromMnemonic', () => {
        var _a;
        const wallet = generateWalletFromMnemonic(mnemonic, "m/44'/118'/0'/0/1", 'cosmos');
        const accounts = wallet.getAccounts();
        expect((_a = accounts[0]) === null || _a === void 0 ? void 0 : _a.address).toBe(referenceWallets.ref2.addresses.cosmos);
    });
    test('generateWalletsFromMnemonic', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const wallet = generateWalletsFromMnemonic(mnemonic, ["m/44'/118'/0'/0/0", "m/44'/118'/0'/0/1"], 'cosmos');
        const accounts = wallet.getAccounts();
        expect((_a = accounts[0]) === null || _a === void 0 ? void 0 : _a.address).toBe(referenceWallets.ref1.addresses.cosmos);
        expect((_b = accounts[1]) === null || _b === void 0 ? void 0 : _b.address).toBe(referenceWallets.ref2.addresses.cosmos);
    }));
    test('generateWalletFromMnemonic throws error if mnemonic is invalid', () => {
        expect(() => generateWalletFromMnemonic('', "m/44'/118'/0'/0/0", 'cosmos')).toThrow('Invalid mnemonic');
    });
    test('generateWalletsFromMnemonic throws error if mnemonic is invalid', () => {
        expect(() => generateWalletsFromMnemonic('', ["m/44'/118'/0'/0/0"], 'cosmos')).toThrow('Invalid mnemonic');
    });
});
