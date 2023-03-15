import { fail } from '@sveltejs/kit';
import { transformAndValidate, type ClassType } from 'class-transformer-validator';
import type { ValidationError } from 'class-validator';

/**
 * An object of DTO property name keys and an array
 * of validation error message strings for that property.
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * Base interface for DTO validation results.
 */
export interface DTOValidationResult {
  /**
   * Whether validation was successful.
   */
  ok: boolean;
}

/**
 * @extends DTOValidationResult
 */
export interface DTOValidationSuccessResult<T> extends DTOValidationResult {
  ok: true;

  /**
   * The validated DTO instance from the Request FormData.
   */
  dto: T;
}

export interface DTOValidationFailResult extends DTOValidationResult {
  ok: false;

  /**
   * An object of DTO property name keys and an array
   * of validation error message strings for that property.
   */
  errors: ValidationErrors;
}

/**
 * Transforms and validates the form data in the request using the DTO provided.
 */
export async function validateDTO<T extends object>(
  request: Request,
  dtoClass: ClassType<T>
): Promise<DTOValidationSuccessResult<T> | DTOValidationFailResult> {
  const formData = await request.formData();

  const parsedData: Record<string, unknown> = {};

  for (const entry of formData.entries()) {
    parsedData[entry[0]] = entry[1];
  }

  let dto: T;

  try {
    dto = await transformAndValidate(dtoClass, parsedData);
  } catch (error) {
    if (error instanceof Array<ValidationError>) {
      const errors: Record<string, string[]> = {};

      for (const validationError of error) {
        if (validationError.constraints) {
          errors[validationError.property] = Object.values(validationError.constraints);
        }
      }

      return {
        ok: false,
        errors,
      } as DTOValidationFailResult;
    }

    throw error;
  }

  return {
    ok: true,
    dto,
  } as DTOValidationSuccessResult<T>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Middleware that transforms and validates the form data in the request using
 * the DTO class provided.
 *
 * Automatically returns SvelteKit `ActionFailure` on failure.
 *
 * Otherwise adds the resulting DTO instance to the request object as `request.dto`.
 */
export function ValidateDTO<T extends object>(dtoClass: ClassType<T>) {
  return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const validationResult = await validateDTO(args[0].request, dtoClass);

      if (!validationResult.ok) {
        return fail(400, { errors: validationResult.errors });
      }

      args[0].request.dto = validationResult.dto;

      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
