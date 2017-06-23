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
      this.updateProgress = this.updateProgress.bind(this);
    }

    componentWillMount() {
      // Store a reference to the listener.
      /* istanbul ignore next */
      this.unsubscribeHistory = this.props.router && this.props.router.listenBefore((location) => {
        // Do not show progress bar for already loaded routes.
        if (this.state.loadedRoutes.indexOf(location.pathname) === -1) {
          // Note: progress auto increase to 99% in 1000 ms
          this.updateProgress(-1000);
        }
      });
    }

    componentWillUpdate(newProps, newState) {
      const { loadedRoutes, progress } = this.state;
      const { pathname } = newProps.location;

      // Complete progress when route changes. But prevent state update while re-rendering.
      if (loadedRoutes.indexOf(pathname) === -1 && progress !== 0 && newState.progress < 100) {
        this.updateProgress(100);
        this.setState({  // eslint-disable-line react/no-will-update-set-state
          loadedRoutes: loadedRoutes.concat([pathname]),
        });
      } else if (newProps.progress !== this.props.progress) {
        this.updateProgress(newProps.progress);
      }
    }

    componentWillUnmount() {
      // Unset unsubscribeHistory since it won't be garbage-collected.
      this.unsubscribeHistory = undefined;
    }

    updateProgress(progress) {
      this.setState({ progress });
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
