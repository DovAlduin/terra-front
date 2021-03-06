import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Checkboxes from './Checkboxes';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
  Spinner: () => <p>Spinner</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Checkboxes
      label="Pwout"
      onChange={() => null}
      values={['pwet', 'wxd']}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render loading correctly', () => {
  const tree = renderer.create((
    <Checkboxes label="Pwout" loading />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const value = ['foo'];
  const onChange = jest.fn(newValue => value.splice(0, value.length, ...newValue));
  const wrapper = shallow((
    <Checkboxes
      label="Pwout"
      onChange={onChange}
      values={['pwet', 'wxd']}
      value={value}
    />
  ));

  wrapper.instance().onToggle('pwet');
  expect(onChange).toHaveBeenCalledWith(['foo', 'pwet']);
  wrapper.instance().onToggle('foo');
  expect(onChange).toHaveBeenCalledWith(['pwet']);
});

it('should update values', () => {
  expect(Checkboxes.getDerivedStateFromProps({ })).toBe(null);
  expect(Checkboxes.getDerivedStateFromProps({ values: ['foo', 'bar'] })).toEqual({
    values: [{
      value: 'foo',
      label: 'foo',
    }, {
      value: 'bar',
      label: 'bar',
    }],
  });
});
