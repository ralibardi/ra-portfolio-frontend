import React from 'react';
import { customRender } from '@utils/test-utilities';
import { ComponentArray } from './component-array';

describe('ComponentArray', () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  it('renders all items correctly', () => {
    const { getByText } = customRender(
      <ComponentArray render={(item) => <div>{item}</div>} of={items} />,
    );

    items.forEach((item) => {
      expect(getByText(item)).toBeInTheDocument();
    });
  });

  it('renders items with correct index', () => {
    const { container } = customRender(
      <ComponentArray render={(_, index) => <div>{index}</div>} of={items} />,
    );

    const indexElements = container.querySelectorAll('div');
    indexElements.forEach((element, index) => {
      expect(element.textContent).toBe(index.toString());
    });
  });

  it('renders no items when the array is empty', () => {
    const { container } = customRender(
      <ComponentArray render={(item) => <div>{item}</div>} of={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });
});
