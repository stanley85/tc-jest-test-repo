export type InputChange = {
  group: string;
  name: string;
  result: boolean;
  value: string;
};

export type InputValidate = {
  group: string;
  name: string;
  result: boolean;
  value: string;
};

export type ValidateRule = {
  group: string;
  name: string;
  validate(text: any): boolean;
  required: boolean;
  success: string;
  error: string;
};

export type ValidateRules = ValidateRule[];
