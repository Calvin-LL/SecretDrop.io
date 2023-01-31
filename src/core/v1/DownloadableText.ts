import { saveAs } from "file-saver";

export class DownloadableText {
  constructor(public readonly content: string, public readonly name: string) {}

  download(): void {
    const blob = new Blob([this.content], { type: "text/plain;charset=utf-8" });

    saveAs(blob, this.name);
  }
}
