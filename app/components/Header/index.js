import React from 'react';
import PropTypes from 'prop-types';

import Navbar from './Navbar';
import NavItem from './NavItem';

import {
  StyledHeader,
  StyledUser,
  StyledUserName,
  StyledUserImage,
  LogoWrapper,
  Balances,
} from './styles';

import { Logo } from '../Logo';
import Link from '../Link';

import { formatEth, formatNtz } from '../../utils/amountFormatter';
import { ABI_TOKEN_CONTRACT, conf } from '../../app.config';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.token = this.web3.eth.contract(ABI_TOKEN_CONTRACT).at(conf().ntzAddr);
  }

  get web3() {
    return this.props.web3Redux.web3;
  }

  handleMenuClick(menuIndex) {
    const { onImport, onExport, onLogout } = this.props;
    const handler = [onImport, onExport, onLogout][menuIndex];
    if (typeof handler === 'function') {
      handler();
    }
  }

  render() {
    const { blocky, nickName, location, signerAddr } = this.props;
    const weiBalance = this.web3.eth.balance(signerAddr);
    const babzBalance = this.token.balanceOf(signerAddr);

    return (
      <StyledHeader
        onMouseLeave={this.handleClickOutside}
        fixed={this.props.fixed}
        id="header"
      >
        <Navbar loggedIn={this.props.loggedIn} transparent={this.props.transparent}>
          <Link to="/">
            <LogoWrapper>
              <Logo />
            </LogoWrapper>
          </Link>

          <NavItem
            to="/lobby"
            title="Lobby"
            location={location}
          />

          <NavItem
            to="/dashboard"
            title={
              <StyledUser>
                <StyledUserImage src={blocky} />
                <StyledUserName>
                  {nickName}

                  <Balances>
                    {babzBalance && <span>{formatNtz(babzBalance)} NTZ</span>}
                    {weiBalance && <span>{formatEth(weiBalance, 2)} ETH</span>}
                  </Balances>
                </StyledUserName>
              </StyledUser>
            }
            location={location}
            menu={['Import account', 'Export account', 'Logout']}
            onMenuClick={this.handleMenuClick}
          />
        </Navbar>
      </StyledHeader>
    );
  }
}

Header.propTypes = {
  fixed: PropTypes.bool,
  transparent: PropTypes.bool,
  loggedIn: PropTypes.bool,
  location: PropTypes.object,
  nickName: PropTypes.string,
  blocky: PropTypes.string,
  onLogout: PropTypes.func,
  onImport: PropTypes.func,
  onExport: PropTypes.func,
  web3Redux: PropTypes.object,
  signerAddr: PropTypes.string,
};

Header.defaultProps = {
  transparent: false,
  fixed: false,
  sidebarMini: false,
  logoLg: <span><b>Ace</b>Busters</span>,
  logoSm: <span><b>A</b>B</span>,
};

export default Header;
