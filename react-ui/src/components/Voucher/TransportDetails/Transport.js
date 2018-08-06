import moment from 'moment';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AddDetailsLink } from '../AddDetailsLink';
import { TransportDetials } from './TransportDetials';
import { getTransportDetails, getShowTransportCard } from '../../../reducers';
import {
  updateTransportDetails,
  handleTransportDone,
  resetTransportDetails
} from '../../../actions';
import { ThemeDefaultValues } from '../../../ThemeProvider';
import { Cancel, Transport } from '../../../images';

const Details = styled.div`
  display: grid;
  padding-bottom: 10px;
  justify-items: left;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr 6fr 4fr 1fr;
  border-radius: 2px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 0.625rem, 0, 0.625rem, 0;
`;
const DetailsIcons = styled.img`
  height: 25px;
  width: 25px;
  padding-right: 0.9rem;
  grid-row: span 3;
  padding-left: 0.5rem;
  align-self: center;
`;
const Font = styled.div`
  font-size: 1rem;
  font-family: roboto;
  padding: 0.2rem;
  text-overflow: ellipsis;
`;
const SubFont = styled(Font)`
  font-size: 0.8rem;
  color: #95989a;
  font-style: italic;
  padding: 0.2rem;
`;

const SubFontRight = styled(SubFont)`
  font-size: 0.8rem;
  justify-self: right;
  padding-right: 0.9rem;
`;

const CloseIcons = styled(DetailsIcons)`
  height: 14px;
  width: 14px;
  padding: 0.4rem;
  align-self: start;
  align-items: center;
  cursor: pointer;
`;
const DetailsCard = ({
  transportDetails: {
    deliveryNote,
    date,
    dispatchDocNo,
    dispatchThrough,
    destination,
    motarVechileNo
  },
  onCloseClick
}) => {
  return (
    <Details>
      <DetailsIcons src={Transport} />
      <Font>{deliveryNote}</Font>
      <SubFontRight>{moment(date).format('Do MM YY')}</SubFontRight>
      <CloseIcons src={Cancel} onClick={onCloseClick} />
      <SubFont>{dispatchDocNo}</SubFont>
      <SubFontRight>{motarVechileNo}</SubFontRight>
      <SubFont>{dispatchThrough}</SubFont>
      <SubFontRight>{destination}</SubFontRight>
    </Details>
  );
};

class Tansport extends Component {
  state = {
    onHideLink: true,
    isDisableDone: true,

    isDisableCancle: true
  };

  toggleLink = () => {
    //this.setState(state => ({ onHideLink: !state.onHideLink }));
    this.setState(
      state => ({ onHideLink: !state.onHideLink }),
      () => !this.state.onHideLink && this.props.resetTransportDetails()
    );
  };

  handleCancleOnClick = () => {
    //TODO: reset voucherDetaels from feilds
    //this.props.resetVoucherDetails;
    this.toggleLink();
  };

  handleDoneOnClick = () => {
    this.props.handleTransportDone();
  };

  onCloseClick = () => {
    this.toggleLink();
    this.props.handleTransportDone();
  };

  render() {
    const { transportDetails, updateTransportDetails, showCard } = this.props;
    const isDisable = Object.keys(transportDetails).length > 0 ? false : true;

    return (
      <React.Fragment>
        {this.state.onHideLink ? (
          <AddDetailsLink
            img={ThemeDefaultValues.addVoucherImage.transportDetailsImg}
            addDetailsFieds={'Transport Details'}
            onClick={this.toggleLink}
          />
        ) : !this.state.onHideLink && !showCard ? (
          <TransportDetials
            isDisable={isDisable}
            transportDetails={transportDetails}
            updateTransportDetails={updateTransportDetails}
            handleCancleOnClick={this.handleCancleOnClick}
            handleDoneOnClick={this.handleDoneOnClick}
          />
        ) : (
          <DetailsCard onCloseClick={this.onCloseClick} transportDetails={transportDetails} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    transportDetails: getTransportDetails(state),
    showCard: getShowTransportCard(state)
  };
};

export default connect(mapStateToProps, {
  updateTransportDetails,
  handleTransportDone,
  resetTransportDetails
})(Tansport);
