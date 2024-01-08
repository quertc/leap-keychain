import Container, { Token } from 'typedi';
export const ripemd160Token = new Token('ripemd160');
export const sha256Token = new Token('sha256');
export const setripemd160 = (ripemd160) => {
    Container.set(ripemd160Token, ripemd160);
};
export const setsha256 = (sha256) => {
    Container.set(sha256Token, sha256);
};
