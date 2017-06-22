import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import onClickOutside from 'react-onclickoutside';
import { setAuthState } from '../AccountProvider/actions';

import {
  makeSelectOpen,
  makeSelectActive,
} from './selectors';
import {
  makeBlockySelector,
  makeNickNameSelector,
  makeSelectLoggedIn,
} from '../AccountProvider/selectors';
import {
  toggleMenuOpen,
  toggleMenuActive,
} from './actions';

import TableMenu from '../../components/TableMenu';

class TableMenuContainer extends React.Component {
  handleClickOutside() {
    // only close the menu if it is already open
    if (this.props.open) {
      this.props.toggleMenuOpen();
    }
  }
  render() {
    return <TableMenu {...this.props} />;
  }
}
TableMenuContainer.propTypes = {
  open: React.PropTypes.bool,
  toggleMenuOpen: React.PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  handleClickLogout: () => {
    browserHistory.push('/login');
    return dispatch(setAuthState({ loggedIn: false }));
  },
  toggleMenuOpen: () => dispatch(toggleMenuOpen()),
  toggleMenuActive: () => dispatch(toggleMenuActive()),
});

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  open: makeSelectOpen(),
  active: makeSelectActive(),
  blocky: makeBlockySelector(),
  nickName: makeNickNameSelector(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  onClickOutside(TableMenuContainer),
);
