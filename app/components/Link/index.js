import React from 'react';
import * as PropTypes from 'prop-types';
import invariant from 'invariant';

import A from '../A';

import { makeSelectIsWeb3Connected } from '../../containers/AccountProvider/selectors';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function resolveToLocation(to, router) {
  return typeof to === 'function' ? to(router.location) : to;
}

const isConnectedSelector = makeSelectIsWeb3Connected();

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    const { router } = this.context;
    invariant(
      router,
      '<Link>s rendered outside of a router context cannot navigate.'
    );

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) {
      return;
    }

    event.preventDefault();

    const isConnected = this.context.store ? isConnectedSelector(this.context.store.getState()) : true;
    if (isConnected) {
      router.push(resolveToLocation(this.props.to, router));
    } else {
      window.location = router.createHref(resolveToLocation(this.props.to, router));
    }
  }

  render() {
    const { to, onlyActiveOnIndex, activeComponent, component, ...rest } = this.props;
    let Component = component;

    // Ignore if rendered outside the context of router to simplify unit testing.
    const { router } = this.context;

    if (router) {
      // If user does not specify a `to` prop, return an empty anchor tag.
      if (!to) {
        return <Component {...rest} />;
      }

      const toLocation = resolveToLocation(to, router);
      rest.href = router.createHref(toLocation);

      if (activeComponent && router.isActive(toLocation, onlyActiveOnIndex)) {
        Component = activeComponent;
      }
    }

    return <Component {...rest} onClick={this.handleClick} />;
  }
}

Link.contextTypes = {
  router: PropTypes.object,
  store: PropTypes.object,
};

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  onlyActiveOnIndex: PropTypes.bool.isRequired,
  component: PropTypes.any,
  activeComponent: PropTypes.any,
  onClick: PropTypes.func,
  target: PropTypes.string,
  isConnected: PropTypes.bool,
};

Link.defaultProps = {
  onlyActiveOnIndex: false,
  style: {},
  component: A,
};

export default Link;
