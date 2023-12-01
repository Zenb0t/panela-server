export class ValidationError extends Error {
  constructor(message: string, errors?: string[]) {
    super(message);
    this.name = "ValidationError";

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
