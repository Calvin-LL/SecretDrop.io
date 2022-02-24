import { Blob } from "node:buffer";

/**
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/File.
 *
 * Based on:
 * https://github.com/capricorn86/happy-dom/blob/master/packages/happy-dom/src/file/File.ts (MIT licensed).
 */
export default class File extends Blob {
  public readonly lastModified: number | null = null;
  public readonly name: string | null = null;

  /**
   * Constructor.
   *
   * @param bits File bits.
   * @param name File name.
   * @param [options] Options.
   * @param [options.type] MIME type.
   * @param [options.lastModifier] Last modified. Defaults to Date.now().
   * @param options.lastModified
   */
  constructor(
    bits: ConstructorParameters<typeof Blob>[0],
    name: string,
    options?: { type?: string; lastModified?: number }
  ) {
    super(bits, options);

    this.name = name.replace(/\//g, ":");
    this.lastModified =
      options && options.lastModified ? options.lastModified : Date.now();
  }
}
