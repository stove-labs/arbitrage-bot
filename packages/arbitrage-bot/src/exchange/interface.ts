import { Token } from "../types";
import { EcosystemIdentifier } from "../types";
import { ExchangeIdentifier, ExchangePrice, ExchangeFee } from "./types";

export interface ExchangePlugin {
  identifier: ExchangeIdentifier;
  ecosystemIdentifier: EcosystemIdentifier;
  fetchPrice(baseToken: Token, quoteToken: Token): ExchangePrice;
  getFee(baseToken: Token, quoteToken: Token): ExchangeFee;
}
