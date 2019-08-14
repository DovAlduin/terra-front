import PropTypes from 'prop-types';
import { stringify, parse } from 'query-string';
import React from 'react';

/**
 * Default options for reading and writing from hash.
 */
export const DEFAULT_OPTIONS = {
  encode: false,
  arrayFormat: 'comma',
  sort: false,
  parseNumbers: true,
  parseBooleans: true,
};

/**
 * Decorator for getting an initialState from hash.
 */
export const withHashState = () => WrappedComponent =>
  class WithHashState extends React.Component {
    static propTypes = {
      /** @param {boolean} [listenHash=true] If initialState should be update when hash changes */
      listenHash: PropTypes.bool,
      /** @param {boolean} [updateHash=true] If hash should be updated when initialState changes */
      updateHash: PropTypes.bool,
    };

    static defaultProps = {
      listenHash: true,
      updateHash: true,
    };

    options = DEFAULT_OPTIONS;

    componentDidMount () {
      const { listenHash } = this.props;
      if (listenHash) {
        window.addEventListener('hashchange', this.onHashChange, false);
      }
    }

    componentWillUnmount () {
      this.isUnmount = true;
      window.removeEventListener('hashchange', this.onHashChange, false);
    }

    /**
     * Event listener on hash change, reloads the current state from hash
     */
    onHashChange = () => {
      if (!this.isUnmount) {
        this.forceUpdate();
      }
    };

    getCurrentHashString = state => `#${stringify(state, this.options)}`;

    /**
     * Callback when the state is changed, replace hash with current state
     *
     * @param state
     * @see StateProvider
     */
    updateHashString = state => {
      const { updateHash } = this.props;
      if (updateHash) {
        window.history.replaceState(window.history.state, '', `#${stringify(state, this.options)}`);
      }
    };

    render () {
      const { listenHash, updateHash, ...props } = this.props;
      const initialState = parse(window.location.hash, this.options);
      return (
        <WrappedComponent
          initialState={initialState}
          {...props}
          getCurrentHashString={this.getCurrentHashString}
          onStateChange={this.updateHashString}
        />
      );
    }
  };

export default withHashState;
