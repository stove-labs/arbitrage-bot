export type TriggerCallback = () => Promise<void>;

export interface TriggerPlugin {
  register(triggerCallback: TriggerCallback): void;
  unregister(): void;
}
