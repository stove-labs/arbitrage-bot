# Migrate Quipuswap setup

## Prerequisite

Running instance of Taqueria Tezos sandbox in Docker with port `20000`. 

> Migration scripts use the RPC URL defined in `config.ts`.

## Integration test

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
