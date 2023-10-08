import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const minLength = 8;
        //   add validation logic
          return typeof value === 'string' && value.length >= minLength;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters long';
        },
      },
    });
  };
}
