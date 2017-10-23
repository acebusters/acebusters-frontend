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
  infoIcon,
}) => (
  <Container
    name="notification-container"
    {...{ removing, type, isNotTable }}
  >
    <Wrapper {...{ type, isNotTable }}>
      <Category>{category}</Category>
      <Details>{details}</Details>
      <IconWrapper>
        {dismissable &&
          <ButtonWrapper onClick={() => notifyRemove(txId)}>
            <Icon className="fa fa-times" />
          </ButtonWrapper>
        }
        {!dismissable && infoIcon}
      </IconWrapper>
    </Wrapper>
  </Container>
);
Notification.propTypes = {
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  details: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  dismissable: PropTypes.bool,
  isNotTable: PropTypes.bool.isRequired,
  infoIcon: PropTypes.node,
  notifyRemove: PropTypes.func,
  removing: PropTypes.bool,
  type: PropTypes.string,
  txId: PropTypes.string,
};
Notification.defaultProps = {
  category: 'Creating Account',
  details: '',
  dismissable: true,
  infoIcon: null,
  removing: false,
  type: 'danger',
  txId: '',
};

export default Notification;
