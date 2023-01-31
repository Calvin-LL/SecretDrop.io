import { expect, it } from "vitest";

import { base64ToBuffer, bufferToBase64 } from "@/core/v1/base64";

it.each([
  { array: [1] },
  { array: [1, 2] },
  { array: [1, 2, 3] },
  { array: [1, 2, 3, 4] },
  { array: [1, 2, 3, 4, 5] },
  { array: [1, 2, 3, 4, 5, 6] },
  { array: [1, 2, 3, 4, 5, 6, 7] },
  { array: [1, 2, 3, 4, 5, 6, 7, 8] },
  { array: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
])("should encode then decode $array", async ({ array }) => {
  function getBase64Length(n: number): number {
    return Math.ceil((n / 3) * 4);
  }

  const buffer = new Uint8Array(array);
  const encoded = bufferToBase64(buffer);
  const decoded = new Uint8Array(base64ToBuffer(encoded));

  expect(decoded).toEqual(buffer);
  expect(encoded.length).toEqual(getBase64Length(buffer.byteLength));
});

it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])(
  "should encode then decode first %d bytes",
  async (i) => {
    const buffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const encoded = bufferToBase64(buffer);
    const decoded = new Uint8Array(base64ToBuffer(encoded, i));

    expect(decoded).toEqual(buffer.slice(0, i));
    expect(decoded.byteLength).toEqual(Math.min(i, buffer.byteLength));
  }
);
