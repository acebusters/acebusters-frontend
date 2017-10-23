import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';

import App from 'components/App';
import withProgressBar from 'components/ProgressBar';

import { selectNotifications } from '../Notifications/selectors';
import { makeSelectLoggedIn } from '../AccountProvider/selectors';
import { setAuthState } from '../AccountProvider/actions';

import {
  makeSelectProgress,
  makeSelectTransferShow,
  selectWorkerProgress,
} from './selectors';

const mapDispatchToProps = (dispatch) => ({
  handleClickLogout: () => {
    browserHistory.push('/login');
    return dispatch(setAuthState({ loggedIn: false }));
  },
});

const mapStateToProps = createStructuredSelector({
  workerProgress: selectWorkerProgress,
  isModalOpen: makeSelectTransferShow(),
  progress: makeSelectProgress(),
  notifications: selectNotifications(),
  loggedIn: makeSelectLoggedIn(),
});

export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
