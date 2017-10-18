import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import InvestTourComponent from '../../components/Dashboard/InvestTour';

import web3Connect from '../AccountProvider/web3Connect';

import { modalAdd, modalDismiss } from '../App/actions';
import { contractEvents, proxyEvents } from '../AccountProvider/actions';
import {
  setActiveTab,
  setAmountUnit,
  setInvestType,
  toggleInvestTour,
} from './actions';
import { getInvestTour } from './selectors';

function InvestTour(props) {
  return (
    <InvestTourComponent
      {...{
        toggleInvestTour: props.toggleInvestTour,
        setActiveTab: props.setActiveTab,
        investTour: props.investTour,
        setAmountUnit: props.setAmountUnit,
      }}
    />
  );
}
InvestTour.propTypes = {
  setActiveTab: PropTypes.func,
  setAmountUnit: PropTypes.func,
  investTour: PropTypes.bool.isRequired,
  toggleInvestTour: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
  setInvestType,
  setActiveTab,
  setAmountUnit,
  modalAdd,
  modalDismiss,
  proxyEvents,
  contractEvents,
  toggleInvestTour,
});

const mapStateToProps = createStructuredSelector({
  investTour: getInvestTour(),
});

export default web3Connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvestTour);
