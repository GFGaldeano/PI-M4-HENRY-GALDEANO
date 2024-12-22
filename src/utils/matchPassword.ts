import { 
    ValidatorConstraint, 
    ValidatorConstraintInterface, 
    ValidationArguments 
  } from 'class-validator';
  
  @ValidatorConstraint({
    name: 'matchPassword',
    async: false,
  })
  export class MatchPassword implements ValidatorConstraintInterface {
    validate(
      password: string, 
      args: ValidationArguments,
    ): boolean | Promise<boolean> {
      if (password !== args.object[args.constraints[0]]) return false;
      return true;
    }
  }
  