import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSignerAddrSelector,
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
} from '../AccountProvider/selectors';

import Header from '../../components/Header';

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  signerAddr: makeSignerAddrSelector(),
  nickName: makeNickNameSelector(),
  blocky: makeBlockySelector(),
});

export default connect(mapStateToProps)(Header);
