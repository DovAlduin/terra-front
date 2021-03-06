import React from 'react';
import PropTypes from 'prop-types';
import withDeviceSize from '../hoc/withDeviceSize';

import NavBarItemDesktop from './NavBarItemDesktop';
import NavBarItemTablet from './NavBarItemTablet';

const MainMenuItem = ({ component, isMobileSized, isPhoneSized, id, ...props }) => {
  const defaultComponent = isMobileSized ? NavBarItemTablet : NavBarItemDesktop;
  const Component = component || defaultComponent;

  return (
    <Component
      key={id}
      id={id}
      {...props}
    />
  );
};

MainMenuItem.propTypes = {
  component: PropTypes.func,
  isMobileSized: PropTypes.bool,
  isPhoneSized: PropTypes.bool,
  id: PropTypes.string,
};

MainMenuItem.defaultProps = {
  component: null,
  isMobileSized: false,
  isPhoneSized: false,
  id: undefined,
};

export default withDeviceSize()(MainMenuItem);
