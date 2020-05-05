export default class CardError extends Error {
  name = "CardError";
  title: string;

  constructor(title: string, message: string) {
    super(message);

    this.title = title;
  }
}
