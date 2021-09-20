import { ValidateRule, ValidateRules } from '../../types/input';

export function validate(event: CustomEvent, group: string, name: string, value: string, dirty: boolean = false) {
  const rules = (event.detail.rules as ValidateRules) || [];
  console.log('inside validate.ts: JSON.stringify(rules)', JSON.stringify(rules));
  if (rules.length) {
    const rule = rules.find((rule: ValidateRule) => {
      if (typeof rule === 'undefined') {
        return false;
      }
      return rule.group === group && rule.name === name;
    }) as ValidateRule;
    console.log('inside validate.ts: JSON.stringify(typeof rule.validate)', JSON.stringify(typeof rule.validate));
    if (rule && typeof rule.validate === 'function') {
      const required = typeof rule.required !== 'undefined' ? rule.required : false;
      return (dirty && rule.validate(value)) || (!dirty && !required);
    } else {
      return null;
    }
  }
  return true;
}

export function isSubmit(event: CustomEvent) {
  return event.detail.submit;
}

export function getMessage(event: CustomEvent, group: string, name: string, result: boolean) {
  const isSubmit = event.detail.submit;
  const rules = (event.detail.rules as ValidateRules) || [];
  if (rules.length) {
    const rule = rules.find((rule: ValidateRule) => {
      return typeof rule !== 'undefined' && rule.group === group && rule.name === name;
    }) as ValidateRule;
    if (typeof rule === 'undefined') {
      return '';
    }
    if (result === null && isSubmit && rule.required) {
      return 'This field is required';
    }
    return result !== null ? (result ? rule.success : rule.error) : '';
  }
  return '';
}
