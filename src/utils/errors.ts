export class ValidationError extends Error {
  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = "ValidationError";

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
