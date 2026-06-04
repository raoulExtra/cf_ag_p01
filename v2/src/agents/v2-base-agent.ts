import { BaseAgent } from "../../v1/src/agents/base-agent";
import { KVStore } from "../../v1/src/shared/kv-store";

export class V2BaseAgent extends BaseAgent {
  private durableObjectsEnabled: boolean = false;

  static getVersion(): string {
    return "V00.15.00";
  }

  protected getKVStore(): KVStore {
    if (this.simMode || !this.durableObjectsEnabled) {
      return new KVStore(this.env.FILES);
    }
    return new KVStore(this.env.FILES);
  }

  setDurableObjects(enabled: boolean) {
    this.durableObjectsEnabled = enabled;
  }
}