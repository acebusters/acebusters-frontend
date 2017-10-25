import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import App from 'components/App';
import withProgressBar from 'components/ProgressBar';

import { makeSelectLoggedIn } from '../AccountProvider/selectors';

import {
  makeSelectProgress,
  makeSelectTransferShow,
  selectWorkerProgress,
} from './selectors';

const mapStateToProps = createStructuredSelector({
  workerProgress: selectWorkerProgress,
  isModalOpen: makeSelectTransferShow(),
  progress: makeSelectProgress(),
  loggedIn: makeSelectLoggedIn(),
});

export default connect(mapStateToProps)(withProgressBar(App));
