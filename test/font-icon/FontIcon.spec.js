import React from 'react';
import { shallow } from 'enzyme';
import FontIcon from './../../src/components/font-icon/FontIcon';

describe('FontIcon', () => {
  it('should render correct icon', () => {
    const icon = 'shoutem';
    const wrapper = shallow(<FontIcon name={icon} />);

    const renderedIcon = wrapper.find('.se-icon-shoutem');
    assert.lengthOf(renderedIcon, 1, 'Icon with defined name is not found.');
  });
});
