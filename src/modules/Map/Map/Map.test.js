import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';
import { Map } from './Map';


const props = {
  map: mapboxgl.Map(),
  styles: {},
  accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
};

jest.mock('mapbox-gl', () => {
  const off = jest.fn();
  const map = {
    addControl: jest.fn(() => {}),
    removeControl: jest.fn(() => {}),
    flyTo: jest.fn(() => {}),
    setMaxBounds: jest.fn(() => [
      [-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327], // France coordinates
    ]),
    setMaxZoom: jest.fn(() => 20),
    setMinZoom: jest.fn(() => 5),
    setStyle: jest.fn(() => 'mapbox://styles/mapbox/light-v9'),
    setLayoutProperty: jest.fn(),
    setPaintProperty: jest.fn(),
    setFilter: jest.fn(),
    on: jest.fn((event, layer, fn) => {
      fn({});
      return off;
    }),
    getCanvas: jest.fn(() => ({
      style: {},
    })),
    once: jest.fn((event, fn) => {
      fn(map);
      return off;
    }),
    getStyle: jest.fn(() => ({ layers: [{ id: 'foo' }, { id: 'bar' }] })),
    touchZoomRotate: {
      enableRotation: jest.fn(),
      disableRotation: jest.fn(),
    },
  };
  const PopupFunctions = {};
  const Popup = jest.fn(() => PopupFunctions);
  PopupFunctions.setLngLat = jest.fn(() => PopupFunctions);
  PopupFunctions.setHTML = jest.fn(() => PopupFunctions);
  PopupFunctions.addTo = jest.fn(() => PopupFunctions);
  PopupFunctions.setDOMContent = jest.fn(() => PopupFunctions);
  Popup.functions = PopupFunctions;
  return {
    off,
    Map: jest.fn(() => map),
    ScaleControl: jest.fn(() => {}),
    NavigationControl: jest.fn(() => {}),
    AttributionControl: jest.fn(() => {}),
    Popup,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should render correctly', () => {
  const tree = renderer.create(<Map {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Mount and update methods', () => {
  it('should call initMapProperties in mount', () => {
    jest.spyOn(Map.prototype, 'initMapProperties');
    const wrapper = shallow(<Map {...props} />);
    expect(wrapper.instance().initMapProperties).toHaveBeenCalled();
  });

  it('should call updateMapProperties in update', () => {
    const wrapper = shallow(<Map {...props} />);
    jest.spyOn(wrapper.instance(), 'updateMapProperties');
    wrapper.setProps({ maxZoom: 7 });
    expect(wrapper.instance().updateMapProperties).toHaveBeenCalled();
  });

  it('should call updateFlyTo in updateMapProperties', () => {
    const wrapper = shallow(<Map {...props} />);
    jest.spyOn(wrapper.instance(), 'updateFlyTo');
    wrapper.setProps({ maxZoom: 7 });
    expect(wrapper.instance().updateFlyTo).toHaveBeenCalled();
  });
});

describe('on properties changes', () => {
  it('should call flyTo and set new flyTo on update', () => {
    const wrapper = shallow(<Map {...props} />);
    const flyTo = {
      center: [10, 9],
      zoom: 7,
      speed: true,
      curve: false,
      easing: () => {},
    };

    wrapper.setProps({ flyTo });
    expect(props.map.flyTo).toHaveBeenCalledWith(flyTo);
  });

  it('should call flyTo and not update flyTo property', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 9 });
    expect(props.map.flyTo).not.toHaveBeenCalled();
  });

  it('should call setMaxBound on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: [[0, 0], [0, 0]] });
    expect(props.map.setMaxBounds).toHaveBeenCalled();
  });

  it("should not call setMaxBound if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: false });
    expect(props.map.setMaxBounds).not.toHaveBeenCalled();
  });

  it('should call setMaxZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 7 });
    expect(props.map.setMaxZoom).toHaveBeenCalled();
  });

  it("should not call setMaxZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 20 });
    expect(props.map.setMaxZoom).not.toHaveBeenCalled();
  });

  it('should call setMinZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 7 });
    expect(props.map.setMinZoom).toHaveBeenCalled();
  });

  it("should not call setMinZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 0 });
    expect(props.map.setMinZoom).not.toHaveBeenCalled();
  });

  it('should call setStyle on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'createLayers');
    wrapper.setProps({ backgroundStyle: 'foo' });
    expect(props.map.setStyle).toHaveBeenCalledWith('foo');
    expect(instance.createLayers).toHaveBeenCalled();
  });

  it("should not call setStyle if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ styles: 'mapbox://styles/mapbox/light-v9' });
    expect(props.map.setStyle).not.toHaveBeenCalled();
  });

  it('should call addControl on init', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();
    expect(props.map.addControl).toHaveBeenCalledWith(instance.scaleControl);
    expect(props.map.addControl).toHaveBeenCalledWith(instance.navigationControl);
    expect(props.map.addControl).toHaveBeenCalledWith(instance.attributionControl);
    expect(props.map.addControl).toHaveBeenCalledTimes(3);
  });

  it('should not call removeControl on init', () => {
    shallow(<Map {...props} />);
    expect(props.map.removeControl).toHaveBeenCalledTimes(0);
  });

  it('should call addControl if true or removeControl if false', () => {
    const wrapper = shallow(<Map {...props} />);

    wrapper.setProps({ displayScaleControl: false });
    wrapper.setProps({ displayNavigationControl: false });
    wrapper.setProps({ displayAttributionControl: false });
    expect(props.map.addControl).toHaveBeenCalledTimes(3);
    expect(props.map.removeControl).toHaveBeenCalledTimes(3);

    wrapper.setProps({ displayScaleControl: true });
    wrapper.setProps({ displayNavigationControl: true });
    wrapper.setProps({ displayAttributionControl: true });
    expect(props.map.addControl).toHaveBeenCalledTimes(6);
    expect(props.map.removeControl).toHaveBeenCalledTimes(3);
  });
});

it('should toggle attribution control', () => {
  const instance = new Map({ ...props }, {});
  instance.toggleAttributionControl(false);
  expect(props.map.removeControl).not.toHaveBeenCalled();
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  instance.toggleAttributionControl(true);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.attributionControl);
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  const { attributionControl } = instance;
  instance.toggleAttributionControl(false);
  expect(props.map.removeControl).toHaveBeenCalledWith(attributionControl);
  expect(props.map.addControl).not.toHaveBeenCalled();

  instance.toggleAttributionControl(true);
  instance.toggleAttributionControl(true);
  const { attributionControl: attributionControl2 } = instance;
  expect(props.map.removeControl).toHaveBeenCalledWith(attributionControl2);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.attributionControl);
});

it('should toggle scale control', () => {
  const instance = new Map({ ...props }, {});
  instance.toggleDisplayScaleControl(false);
  expect(props.map.removeControl).not.toHaveBeenCalled();
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  instance.toggleDisplayScaleControl(true);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.scaleControl);
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  const { scaleControl } = instance;
  instance.toggleDisplayScaleControl(false);
  expect(props.map.removeControl).toHaveBeenCalledWith(scaleControl);
  expect(props.map.addControl).not.toHaveBeenCalled();

  instance.toggleDisplayScaleControl(true);
  instance.toggleDisplayScaleControl(true);
  const { scaleControl: scaleControl2 } = instance;
  expect(props.map.removeControl).toHaveBeenCalledWith(scaleControl2);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.scaleControl);
});

it('should toggle navigation control', () => {
  const instance = new Map({ ...props }, {});
  instance.toggleNavigationControl(false);
  expect(props.map.removeControl).not.toHaveBeenCalled();
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  instance.toggleNavigationControl(true);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.navigationControl);
  props.map.removeControl.mockClear();
  props.map.addControl.mockClear();

  const { navigationControl } = instance;
  instance.toggleNavigationControl(false);
  expect(props.map.removeControl).toHaveBeenCalledWith(navigationControl);
  expect(props.map.addControl).not.toHaveBeenCalled();

  instance.toggleNavigationControl(true);
  instance.toggleNavigationControl(true);
  const { navigationControl: navigationControl2 } = instance;
  expect(props.map.removeControl).toHaveBeenCalledWith(navigationControl2);
  expect(props.map.addControl).toHaveBeenCalledWith(instance.navigationControl);
});

it('should exec toggleControl', () => {
  const instance = shallow(<Map {...props} />).instance();
  jest.spyOn(instance, 'toggleControl');
  instance.toggleNavigationControl(false);
  instance.toggleNavigationControl(true);
  instance.toggleAttributionControl(false);
  instance.toggleAttributionControl(true);
  instance.toggleDisplayScaleControl(false);
  instance.toggleDisplayScaleControl(true);
  expect(instance.toggleControl).toHaveBeenCalledTimes(6);
});

it('should toggle rotate', () => {
  const instance = new Map({ ...props }, {});
  instance.props.rotate = true;
  instance.toggleRotate();
  expect(props.map.touchZoomRotate.enableRotation).toHaveBeenCalled();
  instance.props.rotate = false;
  instance.toggleRotate();
  expect(props.map.touchZoomRotate.disableRotation).toHaveBeenCalled();
});

it('should update rotate', () => {
  Map.prototype.toggleRotate = jest.fn();
  const wrapper = shallow(<Map {...props} />);
  Map.prototype.toggleRotate.mockClear();
  wrapper.setProps({ rotate: true });
  expect(Map.prototype.toggleRotate).toHaveBeenCalled();
});

it('should create layers', () => {
  const map = {
    addSource: jest.fn(),
    addLayer: jest.fn(),
  };
  const customStyle = {
    sources: [{
      id: 'foo',
      type: 'vector',
      url: 'somewhere',
    }],
    layers: [{
      id: 'layer1',
    }, {
      id: 'layer2',
    }],
  };
  const instance = new Map({ map, customStyle }, {});
  instance.createLayers();
  expect(map.addSource).toHaveBeenCalledTimes(1);
  expect(map.addLayer).toHaveBeenCalledTimes(2);
  expect(map.addSource).toHaveBeenCalledWith('foo', {
    type: 'vector',
    url: 'somewhere',
  });
  expect(map.addLayer).toHaveBeenCalledWith({ id: 'layer1' });
  expect(map.addLayer).toHaveBeenCalledWith({ id: 'layer2' });
});