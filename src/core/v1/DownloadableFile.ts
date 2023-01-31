import { saveAs } from "file-saver";

export class DownloadableFile {
  constructor(
    public readonly buffer: ArrayBuffer,
    public readonly name: string
  ) {}

  download(): void {
    saveAs(new Blob([this.buffer]), this.name);
  }
}
