import { HDKey } from '@scure/bip32';
export var Bip32;
(function (Bip32) {
    function derivePath(key, path) {
        const childKey = key.derive(path);
        return {
            publicKey: childKey.publicKey,
            privateKey: childKey.privateKey,
            sign: (hash) => Bip32.sign(childKey, hash),
        };
    }
    Bip32.derivePath = derivePath;
    function fromSeed(seed) {
        const key = HDKey.fromMasterSeed(seed);
        return {
            derive: (path) => key.derive(path),
            publicKey: key.publicKey,
            privateKey: key.privateKey,
        };
    }
    Bip32.fromSeed = fromSeed;
    function sign(key, message) {
        return key.sign(message);
    }
    Bip32.sign = sign;
})(Bip32 || (Bip32 = {}));
