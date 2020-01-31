import Key from "./Key";

export default class PrivateKey extends Key {
  constructor(keyString?: string) {
    super("private", keyString);
  }
}
