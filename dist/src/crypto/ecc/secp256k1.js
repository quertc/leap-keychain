import * as _Secp256k1 from '@noble/secp256k1';
import Container, { Token } from 'typedi';
export var Secp256k1;
(function (Secp256k1) {
    function getPublicKey(privateKey, compressed) {
        return _Secp256k1.getPublicKey(privateKey, compressed);
    }
    Secp256k1.getPublicKey = getPublicKey;
    function sign(message, privateKey, options) {
        return _Secp256k1.sign(message, privateKey, {
            canonical: options === null || options === void 0 ? void 0 : options.canonical,
            extraEntropy: options === null || options === void 0 ? void 0 : options.extraEntropy,
            der: false,
        });
    }
    Secp256k1.sign = sign;
    function publicKeyConvert(publicKey, compressed) {
        const pubKeyPoint = _Secp256k1.Point.fromHex(publicKey);
        return pubKeyPoint.toRawBytes(compressed);
    }
    Secp256k1.publicKeyConvert = publicKeyConvert;
})(Secp256k1 || (Secp256k1 = {}));
export const secp256k1Token = new Token('secp256k1');
export const setSecp256k1 = (secp256k1) => {
    Container.set(secp256k1Token, secp256k1);
};
