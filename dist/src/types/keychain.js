export var WALLETTYPE;
(function (WALLETTYPE) {
    WALLETTYPE[WALLETTYPE["SEED_PHRASE"] = 0] = "SEED_PHRASE";
    WALLETTYPE[WALLETTYPE["PRIVATE_KEY"] = 1] = "PRIVATE_KEY";
    WALLETTYPE[WALLETTYPE["SEED_PHRASE_IMPORTED"] = 2] = "SEED_PHRASE_IMPORTED";
    WALLETTYPE[WALLETTYPE["LEDGER"] = 3] = "LEDGER";
})(WALLETTYPE || (WALLETTYPE = {}));
