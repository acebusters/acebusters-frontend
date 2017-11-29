import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import InvestTourComponent from '../../components/Dashboard/InvestTour';

import web3Connect from '../AccountProvider/web3Connect';

import { contractEvents, proxyEvents } from '../AccountProvider/actions';
import {
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
        investTour: props.investTour,
        setAmountUnit: props.setAmountUnit,
      }}
    />
  );
}
InvestTour.propTypes = {
  setAmountUnit: PropTypes.func,
  investTour: PropTypes.bool.isRequired,
  toggleInvestTour: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
  setInvestType,
  setAmountUnit,
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
