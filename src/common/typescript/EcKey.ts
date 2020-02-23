import { ec as EC } from "elliptic";

export default class EcKey {
  protected ec: EC;

  constructor(curveType: string = "curve25519") {
    this.ec = new EC(curveType);
  }
}
