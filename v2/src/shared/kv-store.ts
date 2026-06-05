import { KVStore as V1KVStore } from "../../../v1/src/shared/kv-store";

const VERSION = "V00.22.00";

export class KVStore {
  static getVersion(): string {
    return "V00.22.00";
  }
  private store: R2Bucket | DurableObjectNamespace;
  private isDurableObjects: boolean;

  constructor(files: R2Bucket, agentsDO?: DurableObjectNamespace) {
    if (agentsDO) {
      this.store = agentsDO;
      this.isDurableObjects = true;
    } else {
      this.store = files;
      this.isDurableObjects = false;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (this.isDurableObjects) {
      const id = this.store.idFromName(key);
      const stub = this.store.getStub(id);
      const response = await stub.fetch(`/get/${key}`);
      const text = await response.text();
      if (!text || text === "null") return null;
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    }
    const value = await this.store.get(key);
    if (!value) return null;
    try {
      return JSON.parse(await value.text());
    } catch {
      return null;
    }
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    if (this.isDurableObjects) {
      const id = this.store.idFromName(key);
      const stub = this.store.getStub(id);
      await stub.fetch(`/set/${key}`, {
        method: "POST",
        body: JSON.stringify(value)
      });
    } else {
      await this.store.put(key, JSON.stringify(value));
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    const current = await this.get<number>(key) || 0;
    const newValue = current + amount;
    await this.set(key, newValue);
    return newValue;
  }

  async append(key: string, item: any): Promise<any[]> {
    const current = await this.get<any[]>(key) || [];
    current.push(item);
    await this.set(key, current);
    return current;
  }

  async delete(key: string): Promise<void> {
    if (this.isDurableObjects) {
      const id = this.store.idFromName(key);
      const stub = this.store.getStub(id);
      await stub.fetch(`/delete/${key}`, { method: "DELETE" });
    } else {
      await this.store.delete(key);
    }
  }
}

export function getVersion(): string {
  return KVStore.getVersion();
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.22.00 | 2026-06-04 | ai(cline) | Update version for consistency |
// | V00.21.00 | 2026-06-04 | ai(cline) | Add VERSION constant for consistency |
// | V00.20.00 | 2026-06-04 | ai(cline) | Fix getVersion to return correct version |
// | V00.18.00 | 2026-06-04 | ai(cline) | Complete FR-NF-06 v2 defaults to false |
// | V00.17.00 | 2026-06-04 | ai(cline) | Add Durable Objects support for state storage |
// | V00.16.00 | 2026-06-04 | ai(cline) | Complete V2-STORAGE-03 and V2-STORAGE-04 |
// | V00.01.00 | 2026-05-25 | peter | Initial publication |