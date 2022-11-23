# Migrate Quipuswap setup

## Prerequisite

Running instance of Taqueria Tezos sandbox in Docker with port `20000`. 

> Migration scripts use the RPC URL defined in `config.ts`.

## Integration test

### Defining state

Prices are defined by the depth liquidity of the exchange. Liquidity is the amount of both assets deposited in the exchange. Edit `.env` for changing the initial state for integration tests.

```bash
EXCHANGE_TOKEN_STANDARD=FA12
# EXCHANGE_TOKEN_STANDARD=FA2
LIGO_VERSION=0.9.0
# TOKEN_DEX_1_AMOUNT + TOKEN_DEX_2_AMOUNT < TOKEN_TOTAL_SUPPLY
# Add even more token for Alice for doing token->XTZ->token trades
TOKEN_TOTAL_SUPPLY=237220488388660739260044

# DEX 1 Quipuswap
TOKEN_DEX_1_AMOUNT=198676450055331726699899
TEZ_DEX_1_AMOUNT=145416.563245
# DEX 2 Quipuswap | Vortex
TOKEN_DEX_2_AMOUNT=19272019166664506280072
TEZ_DEX_2_AMOUNT=14223.194732

DEFAULT_TOKEN_ID_FA2=0
```

### Quipuswap <-> Quipuswap

```
npm run migrate:quipuswap
npm run test:integration -- ./test/quipuswapQuipuswap.test.ts
```

### Quipuswap <-> Quipuswap

Unfortunately Vortex migration does not run on latest Tezos protocol `Kathmandu`. Use an older instance of Tezos.

```
npm run migrate:quipuswap:vortex
npm run test:integration -- ./test/quipuswapVortex.test.ts
```
