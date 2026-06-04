import { BaseAgent } from "../v1/src/agents/base-agent";

export class V2Agent extends BaseAgent {
  static getVersion(): string {
    return "V00.11.00";
  }
}