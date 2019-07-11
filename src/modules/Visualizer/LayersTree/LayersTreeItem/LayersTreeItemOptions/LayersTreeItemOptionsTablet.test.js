import React from 'react';
import renderer from 'react-test-renderer';
import LayersTreeProvider from '../../LayersTreeProvider';
import LayersTreeItemOptionsTablet from './LayersTreeItemOptionsTablet';

jest.mock('../LayerFetchValues', () => () => <p>LayerFetchValues</p>);
jest.mock('../FiltersPanel', () => (({ children }) => children));

jest.mock('../FiltersPanel', () => function FiltersPanel () {
  return <p>FiltersPanel</p>;
});

it('should render correctly with widget', () => {
  const tree = renderer.create((
    <LayersTreeProvider>
      <LayersTreeItemOptionsTablet
        isFilterVisible
        form={[]}
      />
    </LayersTreeProvider>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});