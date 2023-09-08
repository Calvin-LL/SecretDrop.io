import { uint8ToBuffer } from "./helpers";

export const V1_VERSION_CODE: number = 1;
export const V1_VERSION_CODE_STRING = V1_VERSION_CODE.toString();
export const V1_VERSION_CODE_BUFFER = uint8ToBuffer(V1_VERSION_CODE);
