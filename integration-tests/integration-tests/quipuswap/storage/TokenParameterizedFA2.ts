const { MichelsonMap } = require("@taquito/michelson-encoder");
import accounts from '../../accounts'

module.exports = (balance) => {
    return {
        ledger: MichelsonMap.fromLiteral({
            [accounts.alice.pkh]: { balance: balance, allowances: [] },
        }),
        operators: new MichelsonMap(),
        token_metadata: MichelsonMap.fromLiteral({
            0: {
                token_id: 0,
                extras: MichelsonMap.fromLiteral({
                    0: Buffer.from(
                        JSON.stringify({
                            name: "Quipu Token",
                            authors: ["Madfish.Solutions"],
                            homepage: "https://quipuswap.com/",
                        })
                    ).toString("hex"),
                }),
            },
        }),
        metadata: MichelsonMap.fromLiteral({
            "": Buffer.from("tezos-storage:here", "ascii").toString("hex"),
            here: Buffer.from(
                JSON.stringify({
                    version: "v0.0.1",
                    description: "Quipuswap Share Pool Token",
                    name: "Quipu Token",
                    authors: ["Madfish.Solutions"],
                    homepage: "https://quipuswap.com/",
                    source: {
                        tools: ["Ligo", "Flextesa"],
                        location: "https://ligolang.org/",
                    },
                    interfaces: ["TZIP-12", "TZIP-16"],
                    errors: [],
                    views: [],
                    tokens: {
                        dynamic: [
                            {
                                big_map: "token_metadata",
                            },
                        ],
                    },
                }),
                "ascii"
            ).toString("hex"),
        }),
        total_supply: balance,
    };
}
