import Key, { HashConfig } from "./Key";

export default class PublicKey extends Key {
  constructor(keyString?: string, config?: Partial<HashConfig>) {
    super("public", keyString, config);
  }
}
