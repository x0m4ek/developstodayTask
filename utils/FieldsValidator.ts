import { Request } from 'express';
import { ValidationError } from './errors/ValidationError.ts';

export const validateFields = (requiredFields: string[]) => (req: Request) => {
  const missingFields = requiredFields.filter((field) => !(field in req.body));
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
    );
  }
};
