import { Response } from 'express';
import { ValidationError } from '../../utils/errors/ValidationError.ts';

export const errorHandler = (err: Error, res: Response) => {
  if (err instanceof ValidationError) {
    return res
      .status(err.StatusCode)
      .json({ message: 'Validation Field Error', error: err.message });
  } else {
    return res
      .status(500)
      .json({ error: 'Iternal Server Error', details: err.message });
  }
};
