import React, { Component } from 'react';
import { connect } from 'react-redux';

import VoucherPicker from './VocuherPicker';
import { VoucherFold } from '../../../images';
import { onCloseVoucherPicker } from '../../../actions';
import { ShowDetailsCard } from '../PartyPicker/index';
import { getSelectedVoucherDetails } from '../../../reducers';
import * as CONSTANTS from '../../../constants';
class Voucher extends Component {
  state = {};

  render() {
    const { selectedVoucher, mode } = this.props;

    return (
      <React.Fragment>
        {Object.keys(selectedVoucher).length > 0 || mode === CONSTANTS.EDIT ? (
          <ShowDetailsCard
            img={VoucherFold}
            name={selectedVoucher.voucherNo}
            address={selectedVoucher.party.name}
            closeBusinessContactCard={this.props.onCloseVoucherPicker}
          />
        ) : (
          <VoucherPicker />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  selectedVoucher: getSelectedVoucherDetails(state)
});
export default connect(mapStateToProps, { onCloseVoucherPicker })(Voucher);
