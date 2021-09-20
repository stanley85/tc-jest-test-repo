import { Component, Prop, State, Event, EventEmitter, Listen, Host, Method, h } from '@stencil/core';
import { InputChange, InputValidate } from '../../types/input';
import { validate, getMessage, isSubmit } from '../../services/input/validate';

@Component({
  tag: 'tc-input',
  styleUrl: 'tc-input.css',
  shadow: true,
})
export class TcInput {
  @Prop() name: string = '';
  @Prop() group: string = '';
  @Prop() label: string = '';
  @Prop() type: string = 'text';
  @Prop() placeholder: string = '';
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) message: string = 'Test';

  @State() value: string = '';
  @State() messageDisplay: string = this.message;
  @State() isValid: boolean = null;
  @State() dirty: boolean = false;

  @Event({
    eventName: 'tc-input-change',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  valueChange: EventEmitter<InputChange>;
  @Event({
    eventName: 'tc-input-validation',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  valueValidate: EventEmitter<InputValidate>;

  @Listen('tc-form-validate', { target: 'body' })
  validateInput(event: CustomEvent) {
    if (this.dirty || isSubmit(event)) {
      console.log('inside tc-input.tsx: JSON.stringify(event.detail.rules)', JSON.stringify(event.detail.rules));
      console.log('inside tc-input.tsx: JSON.stringify(typeof event.detail.rules[0].validate)', JSON.stringify(typeof event.detail.rules[0].validate));
      this.isValid = validate(event, this.group, this.name, this.value, this.dirty);
      const message = getMessage(event, this.group, this.name, this.isValid);
      if (message !== this.message) {
        this.message = message;
        this.valueValidate.emit({
          group: this.group,
          name: this.name,
          result: this.isValid,
          value: this.value,
        });
      }
    }
  }

  @Method()
  async setValue(value: string) {
    this.valueChangeHandler(value);
  }

  valueChangeHandler(value: string) {
    this.value = value;
    this.dirty = !!value.length;
    this.valueChange.emit({ group: this.group, name: this.name, value: value, result: this.isValid });
  }

  onUserInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChangeHandler(value);
  }

  clearValue() {
    this.valueChangeHandler('');
  }

  render() {
    const inputClassNames = ['input input-text'];
    this.disabled ? inputClassNames.push('disabled') : {};
    if ((!this.isValid && !this.dirty) || this.dirty) {
      this.isValid !== null ? inputClassNames.push(this.isValid ? 'success' : 'error') : {};
    }
    return (
      <Host>
        <template is={this.label.length ? 'label' : 'div'} class={inputClassNames.join(' ')}>
          {this.label.length && <span class="label">{this.label}</span>}
          <div class="group">
            <input
              name={this.name}
              type={this.type}
              placeholder={this.placeholder}
              value={this.value}
              onChange={this.onUserInput.bind(this)}
              onInput={this.onUserInput.bind(this)}
              disabled={this.disabled}
            />
            {!this.disabled && (
              <button type="reset" class="icon-reset" name="reset" aria-label="reset" onClick={this.clearValue.bind(this)}>
                {/*<tc-icon size="28" name={ICON.CROSS} />*/}
              </button>
            )}
          </div>
          {this.message.length && ((!this.isValid && !this.dirty) || this.dirty) && <p class="message">{this.message}</p>}
        </template>
      </Host>
    );
  }
}
