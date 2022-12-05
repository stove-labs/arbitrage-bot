# How to add token pair
In this example we will add token pair `XTZ-QUIPU` for 2 exchanges `Vortex` and `QuipuSwap`

We will need to add token (`QUIPU`) and token pair (`XTZ-QUIPU`) for each exchange (`Vortex` and `QuipuSwap`)

We will need `config.json` file. If you don't have `config.json` file, create it with command `init`
```
npx @stove-labs/arbitrage-bot-cli init
```
Console output should look like this

<img width="455" alt="init setup command" src="https://user-images.githubusercontent.com/55109377/205731060-61308bae-eae2-4ed5-976b-ae08ad932362.png">

## Add token to `config.json`
Since we already have `XTZ` token in `config.json`, we will only need to add `QUIPU` token

1. Go to [tzkt.io](tzkt.io) and type `QUIPU` into search bar and click on first result
<img width="1680" alt="tzkt.io search" src="https://user-images.githubusercontent.com/55109377/205731319-ef00a877-ee3f-4a87-b654-85840f522bc9.png">

2. Go to `Tokens` and copy `address` and `decimals`
<img width="1680" alt="tzkt.io QUIPU" src="https://user-images.githubusercontent.com/55109377/205731388-d3060368-b818-441a-92c0-8d24ae8f071b.png">

3. Fill attributes:
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

1. Go to [Vortex analytics](https://app.vortex.network/charts/analytics) and pick your desired token pair, in our case its `XTZ-QUIPU`
<img width="1680" alt="Vortex analytics" src="https://user-images.githubusercontent.com/55109377/205731503-5c8aaeb6-271a-4494-bc47-b86c1a64abad.png">

2. Copy the token pair pool `address`
<img width="1678" alt="Vortex analytics XTZ-QUIPU" src="https://user-images.githubusercontent.com/55109377/205732055-3805a341-c538-4d10-bd90-1fffbdf7215b.png">

3. Fill attributes:
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

1. Go to the [Quipuswap analytics](https://analytics.quipuswap.com/pairs) and pick your desired token pair, in our case its `XTZ-QUIPU`
<img width="1680" alt="Quipuswap analytics" src="https://user-images.githubusercontent.com/55109377/205732228-740adb53-e716-47c6-af2d-574dc7629be8.png">

2. Copy the token pair pool `address`
<img width="1679" alt="Quipuswap analytics XTZ-QUIPU" src="https://user-images.githubusercontent.com/55109377/205732482-eb1c63b0-2293-41a5-a774-2ff992052157.png">

3. Fill attributes:
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

***

After everything command `list` should return this output

<img width="557" alt="list command" src="https://user-images.githubusercontent.com/55109377/205735170-be9a221b-deee-46cb-9911-0cf0ce54238d.png">


