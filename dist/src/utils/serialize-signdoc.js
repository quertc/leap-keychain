import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export function sortObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    for (const key of sortedKeys) {
        result[key] = sortObject(obj[key]);
    }
    return result;
}
export function serializeStdSignDoc(signDoc) {
    const json = JSON.stringify(sortObject(signDoc));
    return new TextEncoder().encode(json);
}
export function serializeSignDoc(signDoc) {
    return SignDoc.encode(SignDoc.fromPartial({
        accountNumber: signDoc.accountNumber,
        authInfoBytes: signDoc.authInfoBytes,
        bodyBytes: signDoc.bodyBytes,
        chainId: signDoc.chainId,
    })).finish();
}
