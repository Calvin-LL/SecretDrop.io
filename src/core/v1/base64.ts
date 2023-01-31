// custom non-standard base64 encode/decode functions
// lots of code from https://github.com/niklasvh/base64-arraybuffer/blob/5339d8f0abed59c893e87116a785bf52acdc17aa/src/index.ts

// differences from standard base64:
// - no padding
// - no `/`

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";

const lookup = new Uint8Array(256);
chars.split("").forEach((c, i) => {
  lookup[c.charCodeAt(0)] = i;
});

/**
 * @description Converts a base64 string to an ArrayBuffer
 * @param s base64 string
 * @param byte number of bytes to convert
 * @returns ArrayBuffer
 */
export function base64ToBuffer(s: string, byte?: number): ArrayBuffer {
  let bufferLength =
    Math.ceil(s.length / 4) * 3 -
    (s.length % 4 === 2 ? 2 : s.length % 4 === 3 ? 1 : 0);
  if (byte !== undefined && byte < bufferLength) {
    bufferLength = Math.ceil(byte / 3) * 3; // round byte to the nearest multiple of 3
  }
  const buffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(buffer);

  for (let i = 0, p = 0; i < s.length && p < bufferLength; i += 4) {
    const encoded1 = lookup[s.charCodeAt(i)];
    const encoded2 = lookup[s.charCodeAt(i + 1)];
    const encoded3 = lookup[s.charCodeAt(i + 2)];
    const encoded4 = lookup[s.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  if (byte !== undefined && byte < bufferLength) {
    return bytes.slice(0, byte).buffer;
  }

  return buffer;
}

export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let result = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i];
    const byte2 = bytes[i + 1];
    const byte3 = bytes[i + 2];

    result += chars[byte1 >> 2];
    result += chars[((byte1 & 3) << 4) | (byte2 >> 4)];
    result += chars[((byte2 & 15) << 2) | (byte3 >> 6)];
    result += chars[byte3 & 63];
  }

  if (bytes.length % 3 === 2) {
    result = result.substring(0, result.length - 1);
  } else if (bytes.length % 3 === 1) {
    result = result.substring(0, result.length - 2);
  }

  return result;
}
