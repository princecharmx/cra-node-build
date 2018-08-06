import { connect } from 'react-redux';
import React, { Component } from 'react';
import Voucher from '../VoucherBuilder';
import { Checkbox } from 'material-ui';
import { Link } from 'react-router-dom';
import { ImageHolder } from '../../AppStyledComponents';
import { AdminIcon, ShippingDetailsIcon } from '../../../images/index';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  updateShippingAddress,
  updatePincode,
  updateCity,
  updateState,
  hideShippingDetailsLink,
  resetShippingDetails,
  setShippingAddress
} from '../../../actions/index';
import {
  getselectedBusinessAccount,
  getShippingAddress,
  getShowLink,
  getHideShippingDetails
} from '../../../reducers';
import { Fields } from '../AddVoucherStyledComponents';
import * as CONSTANTS from '../../../constants';
const ButtonContaner = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: flex-end;
`;

const SubmitButton = styled.div`
  color: ${p => (p.isDisable ? '#95989A' : '#4964DA')};
  padding: 0.5rem;
  &: hover {
    cursor: ${p => (p.isDisable ? 'not-allowed' : 'pointer')};
  }
`;
class ShippingDetails extends Component {
  state = {
    sameBillingAddress: false,
    showLink: true,
    showDetailsCard: false,
    showDetailsInputFields: false
  };

  toggleShowDetailsInputFields = () => {
    this.setState(state => ({
      showDetailsInputFields: !state.showDetailsInputFields,
      showDetailsCard: true
    }));
  };
  toggleBillingAddressCheck = e => {
    this.setState({ sameBillingAddress: e.target.checked });
    if (e.target.checked) {
      this.props.setShippingAddress();
      this.toggleShowDetailsInputFields();
    }
  };

  handleEditOnClick = () => {
    // in edit mode cancel should take it back to vouchers card and in
    // in create mode take it back to + add link
    const { mode } = this.props;

    mode === CONSTANTS.EDIT
      ? //show voucher details card
        this.setState(state => ({
          sameBillingAddress: false,
          showDetailsCard: false,
          showDetailsInputFields: true,
          showLink: false
        }))
      : this.props.hideShippingDetailsLink();
  };

  handleCancleOnClick = () => {
    const { mode } = this.props;
    mode === CONSTANTS.EDIT
      ? this.setState({ showDetailsInputFields: false })
      : this.setState({ showLink: true });
  };
  hideLink = () => {
    this.setState(state => {
      return {
        showDetailsInputFields: true,
        sameBillingAddress: false,
        showDetailsCard: !state.showDetailsCard
      };
    }, this.props.hideShippingDetailsLink);
  };

  isPartyAvailable = business => Object.keys(business || {}).length;

  handleDoneOnClick = () => {
    this.setState(state => {
      return {
        showDetailsInputFields: !state.showDetailsInputFields
      };
    });
  };

  render() {
    const {
      shippingAddress,
      updateShippingAddress,
      selectedBusinessAccount,
      updateCity,
      geocodeByAddress,
      location,
      updatePincode,
      updateState
    } = this.props;
    if (this.state.sameBillingAddress && !this.isPartyAvailable(selectedBusinessAccount)) {
      this.setState({ sameBillingAddress: false });
    }
    const isChecked =
      this.state.sameBillingAddress && this.isPartyAvailable(selectedBusinessAccount);
    const isDisable = false;
    const isEmptyShippingDetails = Object.values(shippingAddress).every(
      value => value === null || value === ''
    );
    const detailsCardAddress =
      Object.keys(shippingAddress).length > 0 ? shippingAddress : selectedBusinessAccount;

    return (
      <React.Fragment>
        {/*Dont show this mode when it is in edit mode */}
        {this.props.showLink && !this.props.showShippingLink && this.props.mode !== 'edit' ? (
          <Link to="#" onClick={this.hideLink}>
            <ImageHolder src={AdminIcon} position="relative" margin="10px" />+ add Shipping Details
          </Link>
        ) : (
          <React.Fragment>
            {!isEmptyShippingDetails &&
              !this.state.showDetailsInputFields && (
                // showdetails caed is not required if it data is already there
                //this.state.showDetailsCard &&
                <Voucher.ShippingDetails
                  {...detailsCardAddress}
                  closeBusinessContactCard={this.handleEditOnClick}
                  src={ShippingDetailsIcon}
                />
              )}
            {this.props.showShippingLink &&
              this.state.showDetailsInputFields && (
                <React.Fragment>
                  <Fields paddingTop={'10px'}>
                    <Checkbox
                      label="Same as billing address"
                      checked={isChecked}
                      onCheck={this.toggleBillingAddressCheck}
                      disabled={!this.isPartyAvailable(selectedBusinessAccount)}
                    />
                    <Voucher.TextInput
                      labelText="Address"
                      hint="Lodha Tower, Lower parel"
                      value={shippingAddress.address}
                      onChange={value => {
                        updateShippingAddress(value);
                      }}
                    />
                    <Voucher.TextInput
                      hint="400014"
                      labelText="Pincode"
                      value={shippingAddress.pincode}
                      onChange={value => {
                        updatePincode(value);
                        value.length >= 6 && geocodeByAddress(value); // onBlur it should fire
                      }}
                    />
                    <Voucher.TextInput
                      hint="Mumbai"
                      labelText="City"
                      value={location.city || shippingAddress.city}
                      onChange={value => {
                        if (location.city !== '') {
                          updateCity(location.city);
                        }
                        updateCity(value);
                      }}
                    />

                    <Voucher.TextInput
                      labelText="State"
                      hint="Maharashtra"
                      value={location.state || shippingAddress.state}
                      onChange={value => {
                        if (location.state) {
                          updateCity(location.state);
                        }
                        updateState(value);
                      }}
                    />
                  </Fields>
                  <ButtonContaner>
                    <SubmitButton
                      isDisable={isDisable}
                      onClick={this.handleCancleOnClick}
                      //onClick={isDisable ? null : this.handleCancleOnClick}
                    >
                      {' '}
                      Cancel
                    </SubmitButton>
                    <SubmitButton
                      isDisable={isDisable}
                      onClick={isDisable ? null : this.handleDoneOnClick}
                    >
                      {' '}
                      Done
                    </SubmitButton>
                  </ButtonContaner>
                </React.Fragment>
              )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

ShippingDetails.propTypes = {
  showLink: PropTypes.bool,
  mode: PropTypes.oneOf(['edit', 'create']),
  selectedBusinessAccount: PropTypes.object,
  updateShippingAddress: PropTypes.func,
  resetShippingDetails: PropTypes.func,
  updatePincode: PropTypes.func,
  updateCity: PropTypes.func,
  updateState: PropTypes.func,
  setShippingAddress: PropTypes.func,
  shippingAddress: PropTypes.object
};
const mapDispatchToProps = {
  updateShippingAddress,
  resetShippingDetails,
  hideShippingDetailsLink,
  updatePincode,
  updateCity,
  updateState,
  setShippingAddress
};

const mapStateToProps = state => {
  const { vouchers } = state;
  return {
    showLink: getShowLink(state),
    showShippingLink: getHideShippingDetails(state),
    selectedBusinessAccount: getselectedBusinessAccount(vouchers),
    shippingAddress: getShippingAddress(vouchers)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingDetails);
