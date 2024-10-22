import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: false })
export class NumberAllowedValidator implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: string): boolean {
    const num = Number(value);
    return !isNaN(num) && value.trim() !== '';
  }

  defaultMessage(): string {
    return `AttemptNo value must be a number`;
  }
}
