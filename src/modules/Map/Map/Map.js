import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';

import { capitalize } from '../../../utils/strings';

import './Map.scss';

export class Map extends React.Component {
  static propTypes = {
    // Mapbox general config
    accessToken: PropTypes.string,
    displayScaleControl: PropTypes.bool,
    displayNavigationControl: PropTypes.bool,
    displayAttributionControl: PropTypes.bool,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxBounds: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.array), PropTypes.bool]),
    rotate: PropTypes.bool,

    // Action to fly out to coordinates
    flyTo: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      zoom: PropTypes.number,
      speed: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      curve: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      easing: PropTypes.func,
    }),

    customStyle: PropTypes.shape({
      sources: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['vector']).isRequired,
        url: PropTypes.string,
        tiles: PropTypes.arrayOf(PropTypes.string),
      })),
      layers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        'source-layer': PropTypes.string,
        type: PropTypes.oneOf(['fill', 'line', 'symbol', 'circle', 'heatmap', 'fill-extrusion', 'raster', 'hillshade', 'background']).isRequired,
        paint: PropTypes.object,
        layout: PropTypes.shape({
          visibility: PropTypes.oneOf(['visible', 'none']),
        }),
      })),
    }),
  };

  static defaultProps = {
    accessToken: '',
    displayScaleControl: true,
    displayNavigationControl: true,
    displayAttributionControl: true,
    maxZoom: 20,
    minZoom: 0,
    maxBounds: false,
    rotate: false,
    flyTo: {},
    customStyle: {},
  };

  mapListeners = [];

  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  // TODO : move to WidgetMap
  updateFlyTo = (prevFlyToConfig, flyToConfig) => {
    if (prevFlyToConfig !== flyToConfig) {
      const { map: { flyTo } } = this.props;
      flyTo(flyToConfig);
    }
  }

  updateMapProperties = prevProps => {
    const {
      map,
      maxZoom,
      backgroundStyle,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
      minZoom,
      maxBounds,
      rotate,
      flyTo,
    } = this.props;

    this.updateFlyTo(prevProps.flyTo, flyTo);

    if (prevProps.maxBounds !== maxBounds) {
      map.setMaxBounds(maxBounds);
    }

    if (prevProps.maxZoom !== maxZoom) {
      map.setMaxZoom(maxZoom);
    }

    if (prevProps.minZoom !== minZoom) {
      map.setMinZoom(minZoom);
    }

    if (prevProps.backgroundStyle !== backgroundStyle) {
      map.setStyle(backgroundStyle);
      map.once('style.load', () => this.createLayers());
    }

    if (displayScaleControl !== prevProps.displayScaleControl) {
      this.toggleDisplayScaleControl(displayScaleControl);
    }

    if (displayNavigationControl !== prevProps.displayNavigationControl) {
      this.toggleNavigationControl(displayNavigationControl);
    }


    if (displayAttributionControl !== prevProps.displayAttributionControl) {
      this.toggleAttributionControl(displayAttributionControl);
    }

    if (rotate !== prevProps.rotate) {
      this.toggleRotate();
    }
  }

  async initMapProperties () {
    const {
      accessToken,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
    } = this.props;

    mapBoxGl.accessToken = accessToken;

    this.createLayers();

    this.toggleDisplayScaleControl(displayScaleControl);

    this.toggleNavigationControl(displayNavigationControl);

    this.toggleAttributionControl(displayAttributionControl);

    this.toggleRotate();
  }

  createLayers () {
    const { map, customStyle: { sources = [], layers = [] } } = this.props;
    sources.forEach(({ id, ...sourceAttrs }) => map.addSource(id, sourceAttrs));
    layers.forEach(layer => map.addLayer(layer));
  }

  toggleControl (display, control) {
    const { map } = this.props;
    const controlAttributeName = `${control}Control`;
    const controlMethod = capitalize(controlAttributeName);

    if (this[controlAttributeName] && !display) {
      map.removeControl(this[controlAttributeName]);
      delete this[controlAttributeName];
    }

    if (display) {
      if (this[controlAttributeName]) {
        map.removeControl(this[controlAttributeName]);
      }
      this[controlAttributeName] = new mapBoxGl[controlMethod]();
      map.addControl(this[controlAttributeName]);
    }
  }

  toggleAttributionControl (display) {
    return this.toggleControl(display, 'attribution');
  }

  toggleNavigationControl (display) {
    return this.toggleControl(display, 'navigation');
  }

  toggleDisplayScaleControl (display) {
    return this.toggleControl(display, 'scale');
  }

  toggleRotate () {
    const { map, rotate } = this.props;
    if (rotate) {
      map.touchZoomRotate.enableRotation();
    } else {
      map.touchZoomRotate.disableRotation();
    }
  }

  render () {
    return null;
  }
}

export default Map;