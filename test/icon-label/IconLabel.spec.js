import React from 'react';
import { shallow } from 'enzyme';
import IconLabel from './../../src/components/icon-label/IconLabel';
import FontIcon from './../../src/components/font-icon/FontIcon';

describe('IconLabel', () => {
  it('should render icon with label', () => {
    const wrapper = shallow(
      <IconLabel iconName="shoutem" >
        test-label
      </IconLabel>
    );

    assert.lengthOf(wrapper.find(FontIcon), 1, 'icon not rendered');

    const renderedText = wrapper.find('.icon-label__label');
    assert.lengthOf(renderedText, 1, 'text not rendered');
    assert.equal(renderedText.text(), 'test-label');
  });

  it('should render icon on right-side', () => {
    const wrapper = shallow(
      <IconLabel iconName="shoutem" right>
        test-label
      </IconLabel>
    );

    const iconRight = wrapper.find('.icon-label__icon.is-right');
    assert.lengthOf(iconRight, 1, 'icon should be to the right of the text');
  });
});
