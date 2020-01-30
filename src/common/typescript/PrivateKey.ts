import Key, { HashConfig } from "./Key";

export default class PrivateKey extends Key {
  constructor(keyString?: string, config?: Partial<HashConfig>) {
    super("private", keyString, config);
  }
}
