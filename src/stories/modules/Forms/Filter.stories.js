import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  text,
  select,
  object,
  number,
  boolean,
  optionsKnob,
} from '@storybook/addon-knobs';

import Filters, {
  TYPE_SINGLE,
  TYPE_MANY,
  TYPE_RANGE,
  TYPE_BOOL,
} from '../../../modules/Forms/Filters';
import './styles.css';
import translateMock from '../../../utils/translate';

const dummyValues = {
  Developper: 'Developper',
  'UX designer': 'UX designer',
  'Project manager': 'Project manager',
};

const dummyMonth = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const translateMockWithDefaultValue = translateMock({
  'terralego.forms.controls.select.empty_item': 'All',
  'terralego.forms.controls.select.no_results': 'No results.',
  'terralego.forms.controls.select.select_placeholder': 'Enter a query first',
  'terralego.forms.controls.select.input_placeholder': 'Filter...',
  'terralego.forms.controls.multiselect.no_results': 'No results.',
  'terralego.forms.controls.multiselect.select_placeholder': 'Enter a query first',
  'terralego.forms.controls.multiselect.input_placeholder': 'Filter...',
  'terralego.forms.controls.generic.empty_item': 'Nothing',
});

// Component used to manage state
const Parent = ({ children, initData, ...props }) => {
  const [state, setState] = React.useState(initData);
  return <div>{children(state, setState)}</div>;
};

storiesOf('Components/Filters', module).add('Single', () => (
  <Parent initData={{
    single_value: '',
    single_value_forced: 'Developper',
    single_value_forced_with_values: '3',
  }}
  >
    {(state, setState) => (
      <Filters
        translate={translateMockWithDefaultValue}
        onChange={data => {
          setState(data);
          action('Properties update')(data);
        }}
        properties={state}
        filters={[{
          property: 'single_value',
          label: 'Single value filter without values',
          type: TYPE_SINGLE,
        }, {
          property: 'single_value_forced',
          label: 'Single value with values',
          type: TYPE_SINGLE,
          values: ['Developper', 'UX designer', 'Project manager'],
        }, {
          property: 'single_value_forced_with_values',
          label: 'Single value filter with values',
          type: TYPE_SINGLE,
          // values: object('Select values', dummyMonth),
          values: dummyMonth,
        }]}
      />
    )}
  </Parent>
));

storiesOf('Components/Filters', module).add('Many', () => (
  <Parent initData={{
    many_values: optionsKnob(
      'Many values with checkboxes',
      dummyValues,
      [],
      { display: 'multi-select' },
    ),
    many_values_select_forced: optionsKnob(
      'Many values forced as select',
      dummyValues,
      [],
      { display: 'multi-select' },
    ),
  }}
  >
    {(state, setState) => (
      <Filters
        onChange={data => {
          setState(data);
          action('Properties update')(data);
        }}
        translate={translateMockWithDefaultValue}
        properties={state}
        filters={[{
          property: 'many_values',
          label: 'Many filter with values',
          type: TYPE_MANY,
          values: ['Developper', 'UX designer', 'Project manager'],
        }, {
          property: 'many_values_select_forced',
          label: 'Many filter with values forced as select',
          type: TYPE_MANY,
          display: 'select',
          values: ['Developper', 'UX designer', 'Project manager'],
        }]}
      />
    )}
  </Parent>
));

storiesOf('Components/Filters', module).add('Range', () => (
  <Parent initData={{
    small_range: [30, 70],
    not_controlable: [1500, 6000],
    large_range: [15460, 40214],
  }}
  >
    {(state, setState) => (
      <Filters
        onChange={data => {
          setState(data);
          action('Properties update')(data);
        }}
        properties={state}
        filters={[{
          property: 'small_range',
          label: 'Small range',
          type: TYPE_RANGE,
          // Below, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
          labelStepSize: 10,
          min: number('Min (small range)', 0, {}, 'Small range'),
          max: number('Max (small range)', 100, {}, 'Small range'),
        }, {
          property: 'not_controlable',
          label: 'Large range with poor precision',
          type: TYPE_RANGE,
          max: 10000,
          // Below, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
          stepSize: 500,
          labelStepSize: 1000,
        }, {
          property: 'large_range',
          label: 'Large range',
          type: TYPE_RANGE,
          min: number('Min (large range)', 0, {}, 'Large range'),
          max: number('Max (large range)', 100000, {}, 'Large range'),
        }, {
          property: 'date_range',
          label: 'Date range',
          format: 'date',
          contiguousCalendarMonths: false,
          allowSingleDayRange: true,
          type: TYPE_RANGE,
        }]}
      />
    )}
  </Parent>
));

storiesOf('Components/Filters', module).add('Boolean', () => (
  <Parent initData={{
    switch_value: boolean('Bool initial value'),
  }}
  >
    {(state, setState) => (
      <Filters
        onChange={data => {
          setState(data);
          action('Properties update')(data);
        }}
        properties={state}
        filters={[{
          property: 'switch_value',
          label: 'Switch filter',
          type: TYPE_BOOL,
        }]}
      />
    )}
  </Parent>
));
