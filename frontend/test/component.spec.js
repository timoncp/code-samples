import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import Component from 'path/to/component';

describe('Component', () => {
  const defaultProps = {
    params: {},
    error: {},
    submitLoginForm: () => null,
  };

  it('should have a form child', () => {
    const wrapper = shallow(<Form {...defaultProps} />);
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('should have a Button with type submit', () => {
    const wrapper = mount(<Form {...defaultProps} />);
    expect(wrapper.find('Button').props().type).to.be.equal('submit');
  });

  it('should not call submitLoginForm() when username is incorrect', () => {
    const submitLoginForm = spy();
    const wrapper = mount(
      <Form {...defaultProps} submitLoginForm={submitLoginForm} />
    );

    wrapper.setState({ username: 'aa' });
    wrapper.find('Button').simulate('click');

    expect(submitLoginForm.callCount).to.be.equal(0);
  });

  it('should change the given field with given value when onTextChange() is called', () => {
    const wrapper = mount(<Form {...defaultProps} />);
    wrapper.instance().onTextChange('username', 'testusername');

    expect(wrapper.instance().state.username).to.be.equal('testusername');
  });
});
