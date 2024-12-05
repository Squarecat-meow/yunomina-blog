import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export async function validateStrict<T extends object>(
  cls: ClassConstructor<T>,
  data: unknown
): Promise<T> {
  if (typeof data !== "object") {
    throw new Error("데이터가 오브젝트가 아니에요!");
  }
  const instance = plainToInstance(cls, data);
  const errors = await validate(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (errors.length > 0) {
    throw errors;
  }
  return instance;
}
