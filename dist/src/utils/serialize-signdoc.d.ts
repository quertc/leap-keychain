import { StdSignDoc } from '../types/tx';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare function sortObject(obj: any): any;
export declare function serializeStdSignDoc(signDoc: StdSignDoc): Uint8Array;
export declare function serializeSignDoc(signDoc: SignDoc): Uint8Array;
