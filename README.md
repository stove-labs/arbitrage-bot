# Stove Labs Arbitrage Bot

This arbitrage bot speculates on the price differences between two markets, by taking advantage of the difference in asset prices and trades for a profit. The strategy is to buy crypto at a lower price on one exchange and sell immediately at a higher price on the other.

<img src="https://user-images.githubusercontent.com/8685779/202001626-0daa3afa-5185-46cb-98a4-eeef2ef14e55.gif" alt="drawing" width="700"/>

## Benefits

- Modular plugin architecture: easy to expand support for more markets; improve reporting capabilities or replacing tailored profit finding algorithms (eg. stable swap).

- Automated price discovery and arbitrage execution and reporting to the console.

- User defined objective for which *base token asset* should be accumulated over time.

- Trade reverts if market conditions change to the worse and therefore profit opportunity vanishes.

- Multiplier for transaction fee can be increased to stay competitive. 

## Limitations

- Does not have a centralized exchange (CEX) plugin
- Current implementation supports two (CFMMs) decentralized exchanges on Tezos blockchain:
    - Quipuswap (v1) XTZ<>Token
    - Vortex XTZ<>Token
- Reporting to console

## Future work
- Policies for restarting the arbitrage bot on failure
- Advanced reporting on arbitrage (keyword: *Accountant Plugin*)
- Quipuswap (v2)
- Token<>Token

For suggestions please open an issue in this Github repository.


## Community support channel
- [Stove Labs Telegram Channel](https://t.me/stove_labs)

## Project Organization

`@stove-labs/arbitrage-bot` is organized as a mono repository from which several npm packages are built and published. High level packages are organized in the `packages/` directory, whereas plugins can be found in `packages/plugins/`. Exchange specific plugins are in `packages/plugins/exchanges/`. Please note that each package has its own README file.

We publish packages to npmjs.org under the `@stove-labs` namespace and packages have usually `@stove-labs/arbitrage-bot-*` format. See below for a complete overview.

| High Level Packages                                                    | Responsibility                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| [@stove-labs/arbitrage-bot](packages/arbitrage-bot)                          | Group every other library and provide higher level utility |
| [@stove-labs/arbitrage-bot-cli](packages/arbitrage-bot-cli)                      | Command line interface to create & load an example config file and to launch the arbitrage bot |

| Low Level Packages                                                     | Responsibility                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [@stove-labs/arbitrage-bot-profit-finder-lite](packages/plugins/arbitrage-bot-profit-finder-lite/) | Calculating optimal swap amounts to extract value through arbitrage                             |
| [@stove-labs/arbitrage-bot-reporter](packages/plugins/arbitrage-bot-reporter/) | Reports events to the console     |
| [@stove-labs/arbitrage-bot-swap-execution](packages/plugins/arbitrage-bot-swap-execution/)           | (Batch) executes swaps           |
| [@stove-labs/arbitrage-bot-token-registry](packages/plugins/arbitrage-bot-token-registry/)         | Provide necessary functions to retrieve detailed token info based on ticker and ecosystem   |
| [@stove-labs/arbitrage-bot-trigger-interval](packages/plugins/arbitrage-bot-trigger-interval/)                             | Trigger lifecycle based on a user defined time interval |
| [@stove-labs/arbitrage-bot-trigger-chain](packages/plugins/arbitrage-bot-trigger-chain/)                       | Advanced trigger that chains lifecycles and has debounce/scheduling functionality          |
| [@stove-labs/arbitrage-bot-exchange-utils](packages/plugins/exchanges/arbitrage-bot-exchange-utils/)   | Provide necessary function to pair tickers to exchange addresses            |
| [@stove-labs/tezos-dex-quipuswap](packages/plugins/exchanges/tezos-dex-quipuswap/)                         | Provide price fetching and operation forging for Quipuswap DEX             |
| [@stove-labs/tezos-dex-vortex](packages/plugins/exchanges/tezos-dex-vortex/)   | Provide price fetching and operation forging for Vortex DEX                  |


### Useful npm command targets/scripts

See the top-level `package.json` "scripts" section. Some common targets are:

* `npm run bootstrap`: Install all dependencies and link packages locally
* `npm run clean`: Recursively delete all build artifacts
* `npm run build`: Compile all packages
* `npm run test:all`: Run all unit tests
* `npm run test:all:watch`: Run all unit tests in watch mode


### [WIP] Running Integration Tests

The arbitrage-bot integration tests are located in the `/integration-tests/` directory. The build steps are still work in progress to ensure a smooth developer experience across various CPU architectures (including M1) and Tezos blockchain protocols.

## Disclaimer

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, **ANY** IMPLIED WARRANTIES OF MERCHANTABILITY, **NONINFRINGEMENT** OR FITNESS FOR A PARTICULAR PURPOSE ARE **ENTIRELY** DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS **OR ANY AFFILIATED PARTIES OR ENTITIES** BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  **PERSONS USING THIS SOFTWARE DO SO ENTIRELY AT THEIR OWN RISK.**

## Credits

Special thanks to those, who have made it possible developing this arbitrage bot:

- Tezos Foundation
- https://github.com/ecadlabs/taquito
- https://github.com/madfish-solutions/quipuswap-core
- https://github.com/Smartlinkhub/DEX
