import { CustomError } from './CustomError.ts';

export class ValidationError extends CustomError {
  StatusCode = 420;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = 'ValidationError';
  }

  serialize(): { message: string } {
    return { message: 'Validation Failed' };
  }
}
