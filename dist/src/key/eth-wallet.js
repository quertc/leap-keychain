var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Wallet } from '@ethersproject/wallet';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util/dist/address';
import { bech32 } from 'bech32';
import { keccak256 } from 'ethereumjs-util';
import * as bytes from '@ethersproject/bytes';
import { fromHex } from '../utils/encoding';
import { serializeSignDoc, serializeStdSignDoc } from '../utils/serialize-signdoc';
import { encodeSecp256k1Signature } from '../utils/encode-signature';
import { HDNode } from '@ethersproject/hdnode';
import { bip39Token, getBip39 } from '../crypto/bip39/bip39-token';
import Container from 'typedi';
export class EthWallet {
    constructor(mnemonic, pvtKey, walletType, options) {
        this.mnemonic = mnemonic;
        this.pvtKey = pvtKey;
        this.walletType = walletType;
        this.options = options;
    }
    /**
     * Generates a wallet from a mnemonic. Returns an EthWallet object.
     * @param mnemonic The mnemonic to generate a wallet from
     * @param options WalletOptions object
     */
    static generateWalletFromMnemonic(mnemonic, options) {
        const bip39 = Container.get(bip39Token);
        bip39.mnemonicToEntropy(mnemonic);
        return new EthWallet(mnemonic, '', 'mnemonic', options);
    }
    /**
     * Generates a wallet from a private key.
     * @param {string} pvtKey - The private key to generate the wallet from.
     * @param {WalletOptions} options - The options for the wallet.
     * @returns {EthWallet} A wallet object.
     */
    static generateWalletFromPvtKey(pvtKey, options) {
        try {
            new Wallet(pvtKey);
        }
        catch (e) {
            throw new Error('Invalid private key');
        }
        return new EthWallet('', pvtKey.replace('0x', ''), 'pvtKey', options);
    }
    getAccounts() {
        const accountsWithPrivKey = this.getAccountsWithPrivKey();
        return accountsWithPrivKey.map((account) => {
            return {
                algo: account.algo,
                address: account.address,
                pubkey: account.pubkey,
            };
        });
    }
    getAccountsWithPrivKey() {
        const bip39 = getBip39();
        const seed = bip39.mnemonicToSeedSync(this.mnemonic);
        return this.options.paths.map((path) => {
            const hdWallet = this.walletType === 'mnemonic' ? HDNode.fromSeed(seed).derivePath(path) : new Wallet(this.pvtKey);
            const ethAddr = EthereumUtilsAddress.fromString(hdWallet.address).toBuffer();
            const bech32Address = bech32.encode(this.options.addressPrefix, bech32.toWords(ethAddr));
            const ethWallet = new Wallet(hdWallet.privateKey);
            return {
                algo: 'ethsecp256k1',
                address: bech32Address,
                ethWallet: ethWallet,
                pubkey: fromHex(ethWallet._signingKey().compressedPublicKey.replace('0x', '')),
            };
        });
    }
    sign(signerAddress, signBytes) {
        const accounts = this.getAccountsWithPrivKey();
        const account = accounts.find(({ address }) => address === signerAddress);
        if (account === undefined) {
            throw new Error(`Address ${signerAddress} not found in wallet`);
        }
        const { ethWallet } = account;
        return ethWallet._signingKey().signDigest(signBytes);
    }
    signMessage(signerAddress, message) {
        const accounts = this.getAccountsWithPrivKey();
        const account = accounts.find(({ address }) => address === signerAddress);
        if (account === undefined) {
            throw new Error(`Address ${signerAddress} not found in wallet`);
        }
        const { ethWallet } = account;
        return ethWallet.signMessage(message);
    }
    signTransaction(signerAddress, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccountsWithPrivKey();
            const account = accounts.find(({ address }) => address === signerAddress);
            if (account === undefined) {
                throw new Error(`Address ${signerAddress} not found in wallet`);
            }
            const { ethWallet } = account;
            return ethWallet.signTransaction(transaction);
        });
    }
    signAmino(signerAddress, signDoc) {
        const accounts = this.getAccountsWithPrivKey();
        const account = accounts.find((account) => account.address === signerAddress);
        if (!account) {
            throw new Error('Signer address does not match wallet address');
        }
        const hash = serializeStdSignDoc(signDoc);
        const rawSignature = this.sign(signerAddress, keccak256(Buffer.from(hash)));
        const splitSignature = bytes.splitSignature(rawSignature);
        const signature = bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));
        return {
            signed: signDoc,
            signature: encodeSecp256k1Signature(account.pubkey, signature),
        };
    }
    signDirect(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = this.getAccountsWithPrivKey();
            const account = accounts.find(({ address }) => address === signerAddress);
            if (account === undefined) {
                throw new Error(`Address ${signerAddress} not found in wallet`);
            }
            const hash = serializeSignDoc(signDoc);
            const rawSignature = this.sign(signerAddress, keccak256(Buffer.from(hash)));
            const splitSignature = bytes.splitSignature(rawSignature);
            const signature = bytes.arrayify(bytes.concat([splitSignature.r, splitSignature.s]));
            return {
                signed: signDoc,
                signature: encodeSecp256k1Signature(account.pubkey, signature),
            };
        });
    }
}
