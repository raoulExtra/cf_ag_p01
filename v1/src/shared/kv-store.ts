export class KVStore {
  static getVersion(): string {
    return "V00.05.00";
  }
  constructor(private files: R2Bucket) {}

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.files.get(key);
    if (!value) return null;
    return JSON.parse(await value.text());
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    await this.files.put(key, JSON.stringify(value));
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
    await this.files.delete(key);
  }
}

// Change History
//
// | Version | Date | Author | Reason |
// |---------|------|--------|--------|
// | V00.05.00 | 2026-06-04 | ai(cline) | Add syst system test requirement |
// | V00.02.00 | 2026-06-04 | ai(cline) | Apply code change history conventions |
// | V00.01.00 | 2026-05-24 | ai(cline) | Initial implementation |