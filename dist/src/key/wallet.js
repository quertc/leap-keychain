var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bech32 } from 'bech32';
import { serializeSignDoc, serializeStdSignDoc } from '../utils/serialize-signdoc';
import { encodeSecp256k1Signature } from '../utils/encode-signature';
import { getBip39 } from '../crypto/bip39/bip39-token';
import { getBip32 } from '../crypto/bip32/hdwallet-token';
import Container from 'typedi';
import { ripemd160Token, sha256Token } from '../crypto/hashes/hashes';
import { secp256k1Token } from '../crypto/ecc/secp256k1';
export function pubkeyToAddress(prefix, publicKey) {
    const ripemd160 = Container.get(ripemd160Token);
    const sha256 = Container.get(sha256Token);
    return bech32.encode(prefix, bech32.toWords(ripemd160(sha256(publicKey))));
}
export class Wallet {
    constructor(wallet, options) {
        this.wallet = wallet;
        this.options = options;
    }
    static generateWallet(mnemonic, options) {
        const bip39 = getBip39();
        const bip32 = getBip32();
        bip39.mnemonicToEntropy(mnemonic);
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const node = bip32.fromSeed(seed);
        return new Wallet(node, options);
    }
    signAmino(signerAddress, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccountsWithPrivKey();
            const account = accounts.find((account) => account.address === signerAddress);
            if (!account) {
                throw new Error('Signer address does not match wallet address');
            }
            if (!account.pubkey || !account.childKey.privateKey) {
                throw new Error('Unable to derive keypair');
            }
            const sha256 = Container.get(sha256Token);
            const hash = sha256(serializeStdSignDoc(signDoc));
            const secp256k1 = Container.get(secp256k1Token);
            const signature = yield secp256k1.sign(hash, account.childKey.privateKey, {
                canonical: true,
                extraEntropy: (signOptions === null || signOptions === void 0 ? void 0 : signOptions.extraEntropy) === false ? undefined : true,
            });
            return {
                signed: signDoc,
                signature: encodeSecp256k1Signature(account.pubkey, signature),
            };
        });
    }
    signDirect(signerAddress, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccountsWithPrivKey();
            const account = accounts.find((account) => account.address === signerAddress);
            if (!account) {
                throw new Error('Signer address does not match wallet address');
            }
            if (!account.pubkey || !account.childKey.privateKey) {
                throw new Error('Unable to derive keypair');
            }
            const sha256 = Container.get(sha256Token);
            const hash = sha256(serializeSignDoc(signDoc));
            const secp256k1 = Container.get(secp256k1Token);
            const signature = yield secp256k1.sign(hash, account.childKey.privateKey, {
                canonical: true,
                extraEntropy: (signOptions === null || signOptions === void 0 ? void 0 : signOptions.extraEntropy) === false ? undefined : true,
            });
            return {
                signed: signDoc,
                signature: encodeSecp256k1Signature(account.pubkey, signature),
            };
        });
    }
    getAccounts() {
        return this.getAccountsWithPrivKey().map((account) => {
            return {
                algo: 'secp256k1',
                address: account.address,
                pubkey: account.pubkey,
            };
        });
    }
    getAccountsWithPrivKey() {
        const childKeys = this.options.paths.map((path) => {
            return this.wallet.derive(path);
        });
        return childKeys.map((childKey) => {
            const publicKey = childKey.publicKey;
            const address = pubkeyToAddress(this.options.addressPrefix, publicKey);
            return {
                algo: 'secp256k1',
                address,
                pubkey: publicKey,
                childKey: childKey,
            };
        });
    }
}
export class PvtKeyWallet {
    constructor(privateKey, publicKey, address) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.address = address;
    }
    static generateWallet(privateKey, addressPrefix) {
        try {
            const sanitizedPvtKey = privateKey.replace('0x', '');
            const pvtKeyBytes = Buffer.from(sanitizedPvtKey, 'hex');
            const secp256k1 = Container.get(secp256k1Token);
            const publicKey = secp256k1.getPublicKey(pvtKeyBytes, true);
            const address = pubkeyToAddress(addressPrefix, publicKey);
            return new PvtKeyWallet(pvtKeyBytes, publicKey, address);
        }
        catch (_a) {
            throw new Error('Invalid private key');
        }
    }
    getAccounts() {
        return [
            {
                algo: 'secp256k1',
                address: this.address,
                pubkey: this.publicKey,
            },
        ];
    }
    signAmino(signerAddress, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccounts();
            const account = accounts.find((account) => account.address === signerAddress);
            if (!account) {
                throw new Error('Signer address does not match wallet address');
            }
            if (!account.pubkey) {
                throw new Error('Unable to derive keypair');
            }
            const sha256 = Container.get(sha256Token);
            const hash = sha256(serializeStdSignDoc(signDoc));
            const secp256k1 = Container.get(secp256k1Token);
            const signature = yield secp256k1.sign(hash, this.privateKey, {
                canonical: true,
                extraEntropy: (signOptions === null || signOptions === void 0 ? void 0 : signOptions.extraEntropy) === false ? undefined : true,
            });
            return {
                signed: signDoc,
                signature: encodeSecp256k1Signature(account.pubkey, signature),
            };
        });
    }
    signDirect(signerAddress, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccounts();
            const account = accounts.find((account) => account.address === signerAddress);
            if (!account) {
                throw new Error('Signer address does not match wallet address');
            }
            const sha256 = Container.get(sha256Token);
            const hash = sha256(serializeSignDoc(signDoc));
            const secp256k1 = Container.get(secp256k1Token);
            const signature = yield secp256k1.sign(hash, this.privateKey, {
                canonical: true,
                extraEntropy: (signOptions === null || signOptions === void 0 ? void 0 : signOptions.extraEntropy) === false ? undefined : true,
            });
            return {
                signed: signDoc,
                signature: encodeSecp256k1Signature(account.pubkey, signature),
            };
        });
    }
}
