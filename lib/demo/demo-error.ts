/** An expected /demo failure, with the HTTP status the API answers with. */
export class DemoError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
