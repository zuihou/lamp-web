import type { Rule } from '/@/components/Form/src/types/form';

export type ValidateRules = {
  // Field name
  field: string;
  // Validation rules
  rules?: Rule[];
};

export type FieldValidatorDesc = {
  field: string;
  fieldType: string;
  constraints: ConstraintInfo[];
};

export type ConstraintInfo = {
  type: string;
  attrs: any;
};
