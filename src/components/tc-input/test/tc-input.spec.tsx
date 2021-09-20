import { newSpecPage } from '@stencil/core/testing';
import { TcInput } from '../tc-input';

describe('tc-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [TcInput],
      html: `<tc-input></tc-input>`,
    });
    expect(page.root).toEqualHtml(`
      <tc-input>
        <mock:shadow-root>
          <template class="input input-text" is="div"></template>
        </mock:shadow-root>
      </tc-input>
    `);
  });
  it('should use label as wrapper if label is set', async () => {
    const page = await newSpecPage({
      components: [TcInput],
      html: `<tc-input label="test"></tc-input>`,
    });
    expect(page.root).toEqualHtml(`
      <tc-input label="test">
        <mock:shadow-root>
          <template class="input input-text" is="label"></template>
        </mock:shadow-root>
      </tc-input>
    `);
  });
});
