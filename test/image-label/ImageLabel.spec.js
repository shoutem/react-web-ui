import React from 'react';
import { shallow } from 'enzyme';
import ImageLabel from './../../src/components/image-label/ImageLabel';

describe('ImageLabel', () => {
  it('should render image with label', () => {
    const wrapper = shallow(<ImageLabel src="test.png">test-label</ImageLabel>);

    const renderedImage = wrapper.find('img');
    assert.lengthOf(renderedImage, 1, 'image not rendered');
    assert.equal(renderedImage.props().src, 'test.png');

    const renderedText = wrapper.find('.image-label__label');
    assert.lengthOf(renderedText, 1);
    assert.equal(renderedText.text(), 'test-label');
  });
});
