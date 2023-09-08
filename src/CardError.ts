export default class CardError extends Error {
  name = "CardError";
  title: string;

  constructor(title: string, message: string, cause?: Error) {
    super(message);

    this.title = title;
    this.cause = cause;
  }
}
