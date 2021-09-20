import { newE2EPage } from '@stencil/core/testing';

describe('tc-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input></tc-input>');

    const element = await page.find('tc-input');
    expect(element).toHaveClass('hydrated');
  });
  it('should give name to input', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input name="test"></tc-input>');

    const input = await page.find('tc-input >>> input');
    expect(input).toEqualAttribute('name', 'test');
  });
  it('should give type to input', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input type="test"></tc-input>');

    const input = await page.find('tc-input >>> input');
    expect(input).toEqualAttribute('type', 'test');
  });
  it('should give placeholder to input', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input placeholder="test"></tc-input>');

    const input = await page.find('tc-input >>> input');
    expect(input).toEqualAttribute('placeholder', 'test');
  });
  it('should send event if input is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input group="address" name="test" type="text"></tc-input>');
    const spyValueValidate = await page.spyOnEvent('tc-input-change');
    const component = await page.find('tc-input');
    await component.callMethod('setValue', 't');
    const expectedSubmit = {
      group: 'address',
      name: 'test',
      result: null,
      value: 't',
    };
    expect(spyValueValidate).toHaveReceivedEventDetail(expectedSubmit);
  });
  it('should validate on request', async () => {
    const page = await newE2EPage();
    await page.setContent('<tc-input group="address" name="test" type="text"></tc-input>');
    const spyValueValidate = await page.spyOnEvent('tc-input-validation');
    const component = await page.find('tc-input');
    await component.callMethod('setValue', 't');
    await page.waitForChanges();
    var eventDetail = {
      submit: true,
      rules: [
        {
          group: 'address',
          name: 'test',
          validate: function (text) {
            console.log('zed', text);
            return text.length > 3;
          },
          success: 'ok',
          error: 'not ok',
        },
      ],
    };
    await component.triggerEvent('tc-form-validate', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: eventDetail,
    });
    await page.waitForChanges();
    const expectedSubmit = {
      group: 'address',
      name: 'test',
      result: false, // TODO: eigentlich müsste das false sein!
      value: 't',
    };
    expect(spyValueValidate).toHaveReceivedEventDetail(expectedSubmit);
  });
});
