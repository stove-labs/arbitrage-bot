# How to add token pair
For this example we picked token pair `XTZ-QUIPU`

We will need to add token (`QUIPU`) and token pair on each exchange (`Vortex` and `QuipuSwap`)

If you don't have `config.json` file, create it with command `init`
  ```
  npx @stove-labs/arbitrage-bot-cli init
  ```
  it should look like this

  TODO: add screen of init command

## Add token to `config.json`
Since we already have `XTZ` token in `config.json`, we will only need to add `QUIPU`

1. Go to [tzkt.io](tzkt.io) and type `QUIPU` into search bar and press on first result

1. Go to `Tokens` and copy `address` and `decimals`

1. Fill attributes:
- `ticker` (`QUIPU`)
- `address` (copied from [tzkt.io](tzkt.io))
- `decimals` (copied from [tzkt.io](tzkt.io))
- `ecosystemIdentifier` (always `TEZOS`)

 it should look like this:
```
{
  "ticker": "QUIPU",
  "address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
  "decimals": 6,
  "ecosystemIdentifier": "TEZOS"
}
```
and add it to the `tokenList` array

## Add Vortex token pair to `config.json`

1. To add Vortex pair, go to the [Vortex analytics](https://app.vortex.network/charts/analytics)
TODO: add screen 

1. Pick your desired token pair, in our case its `XTZ-QUIPU`
TODO: add screen 

1. Copy the token pair pool `address`
TODO: add screen 

1. Fill attributes:
- `address` (copied from [Vortex](https://app.vortex.network/))
- `identifier` (always `VORTEX`)
- `ticker1` (`XTZ`)
- `ticker2` (`QUIPU`)

 it should look like this:
```
{
  "address": "KT1LErZ1878Kyq3xtSc5pwxzTrD7XSZoE2RY",
  "identifier": "VORTEX",
  "ticker1": "XTZ",
  "ticker2": "QUIPU"
}
```
and add it to the `vortex` array under `exchangeList` in `config.json`

## Add Quipuswap token pair to `config.json`

1. Go to the [Quipuswap analytics](https://analytics.quipuswap.com/pairs) and click on desired pair

1. Copy the token pair pool `address`

1. Fill attributes:
- `address` (copied from [Quipuswap](https://analytics.quipuswap.com/pairs))
- `identifier` (always `QUIPUSWAP`)
- `ticker1` (`XTZ`)
- `ticker2` (`QUIPU`)

 it should look like this:
```
{
  "address": "KT1X3zxdTzPB9DgVzA3ad6dgZe9JEamoaeRy",
  "identifier": "QUIPUSWAP",
  "ticker1": "XTZ",
  "ticker2": "QUIPU"
}
```
and add it to the `quipuswap` array under `exchangeList` in `config.json`

