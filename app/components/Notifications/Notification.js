import React from 'react';
import PropTypes from 'prop-types';

import {
  ButtonWrapper,
  Category,
  Container,
  IconWrapper,
  Icon,
  Details,
  Wrapper,
} from './styles';

const Notification = ({
  category,
  details,
  dismissable,
  isNotTable,
  notifyRemove,
  removing,
  type,
  txId,
}) => (
  <Container
    name="notification-container"
    removing={removing}
    type={type}
    isNotTable={isNotTable}
  >
    <Wrapper type={type} isNotTable={isNotTable}>
      <Category>{category}</Category>
      <Details>{details}</Details>
      <IconWrapper>
        {dismissable ?
          <ButtonWrapper onClick={() => notifyRemove(txId)}>
            <Icon className="fa fa-times" />
          </ButtonWrapper>
          :
          <ButtonWrapper>
            <Icon className="fa fa-info-circle" />
          </ButtonWrapper>
        }
      </IconWrapper>
    </Wrapper>
  </Container>
);
Notification.propTypes = {
  category: PropTypes.string,
  details: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  dismissable: PropTypes.bool,
  isNotTable: PropTypes.bool,
  notifyRemove: PropTypes.func,
  removing: PropTypes.bool,
  type: PropTypes.string,
  txId: PropTypes.string,
};
Notification.defaultProps = {
  category: 'Creating Account',
  details: '',
  dismissable: true,
  isNotTable: false,
  removing: false,
  type: 'danger',
  txId: '',
};

export default Notification;
