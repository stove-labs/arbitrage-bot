export interface SwapResult {
  result: { type: 'OK'; operation: any } | { type: 'ERROR'; data: any };
}
