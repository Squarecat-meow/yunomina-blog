import { ValidateIf, ValidationOptions } from "class-validator";

export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((o, v) => v !== null, validationOptions);
}
