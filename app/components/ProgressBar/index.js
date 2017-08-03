import React from 'react';
import ProgressBar from './ProgressBar';

function withProgressBar(WrappedComponent) {
  class AppWithProgressBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        progress: 0,
        loadedRoutes: props.location && [props.location.pathname],
      };
    }

    componentWillMount() {
      // Store a reference to the listener.
      /* istanbul ignore next */
      if (this.props.router) {
        this.unsubscribeHistory = this.props.router.listenBefore((location) => {
          const { pathname } = location;
          this.setState((state) => {
            // Do not show progress bar for already loaded routes.
            if (state.loadedRoutes.indexOf(pathname) === -1) {
              // Note: progress auto increase to 99% in 1000 ms
              return { progress: -1000 };
            }

            return null;
          });
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      // Complete progress when route changes
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.setState((state, props) => {
          const { location: { pathname } } = props;
          if (
            state.loadedRoutes.indexOf(pathname) === -1 &&
            state.progress !== 0 && state.progress < 100
          ) {
            return {
              loadedRoutes: state.loadedRoutes.concat([pathname]),
              progress: 100,
            };
          }

          return null;
        });
      }

      if (nextProps.progress !== this.props.progress) {
        this.setState({ progress: nextProps.progress });
      }
    }

    componentWillUnmount() {
      // Unset unsubscribeHistory since it won't be garbage-collected.
      if (typeof this.unsubscribeHistory === 'function') {
        this.unsubscribeHistory();
        this.unsubscribeHistory = undefined;
      }
    }

    render() {
      const { progress } = this.state;

      return (
        <div>
          <ProgressBar progress={progress} />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }


  AppWithProgressBar.propTypes = {
    location: React.PropTypes.object,
    router: React.PropTypes.object,
    progress: React.PropTypes.number,
  };

  return AppWithProgressBar;
}

export default withProgressBar;
