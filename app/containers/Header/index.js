import { createStructuredSelector } from 'reselect';
import {
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
  makeSignerAddrSelector,
} from '../AccountProvider/selectors';
import web3Connect from '../AccountProvider/web3Connect';

import Header from '../../components/Header';

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  nickName: makeNickNameSelector(),
  signerAddr: makeSignerAddrSelector(),
  blocky: makeBlockySelector(),
});

export default web3Connect(
  mapStateToProps,
)(Header);
