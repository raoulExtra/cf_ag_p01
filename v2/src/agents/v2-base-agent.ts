import { BaseAgent } from "../../../v1/src/agents/base-agent";
import { KVStore } from "../shared/kv-store";

const VERSION = "V00.22.00";

export class V2BaseAgent extends BaseAgent {
  private durableObjectsEnabled: boolean = false;

  static getVersion(): string {
    return "V00.22.00";
  }

  protected getKVStore(): KVStore {
    if (this.simMode || !this.durableObjectsEnabled) {
      return new KVStore(this.env.FILES);
    }
    return new KVStore(this.env.FILES, this.env.AGENTS_DO);
  }

  setDurableObjects(enabled: boolean) {
    this.durableObjectsEnabled = enabled;
  }
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.22.00 | 2026-06-04 | ai(cline) | Update version for consistency |
// | V00.21.00 | 2026-06-04 | ai(cline) | Update version for consistency |
// | V00.20.00 | 2026-06-04 | ai(cline) | Fix version to V00.20.00 |
// | V00.18.00 | 2026-06-04 | ai(cline) | Complete FR-NF-06 v2 defaults to false |
// | V00.17.00 | 2026-06-04 | ai(cline) | Add Durable Objects binding for real DO storage |
// | V00.16.00 | 2026-06-04 | ai(cline) | Complete V2-STORAGE-03 and V2-STORAGE-04 |
// | V00.01.00 | 2026-05-25 | peter | Initial publication |