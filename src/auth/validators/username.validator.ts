import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
          return typeof value === 'string' && validUsernamePattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid username format';
        },
      },
    });
  };
}
