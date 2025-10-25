import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeConfig: ValidationPipeOptions = {
  whitelist: true, // Strip properties that don't have decorators
  transform: true, // Automatically transform payloads to DTO instances
  forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
  transformOptions: {
    enableImplicitConversion: true, // Convert types automatically (e.g., string to number)
  },
  validationError: {
    target: false, // Don't expose target object in errors
    value: false, // Don't expose value in errors
  },
};
