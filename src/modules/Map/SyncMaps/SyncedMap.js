import React from 'react';

import { context } from './SyncMaps';

export class SyncedMap extends React.Component {
  static contextType = context;

  getMap = map => {
    const { addMap } = this.context;
    addMap(map);
  }

  render () {
    const { children } = this.props;
    const { getMap } = this;

    return React.Children.map(children, child =>
      React.cloneElement(child, {
        onMapInit: getMap,
      }));
  }
}

export default SyncedMap;
