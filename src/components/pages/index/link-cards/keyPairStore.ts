import { KeyPair } from "@/core/v1/KeyPair";

const keyPair = import.meta.env.SSR ? undefined : new KeyPair();

export const publicKeyString = keyPair?.publicKey.toString() ?? "";
export const privateKeyString = keyPair?.privateKey.toString() ?? "";
