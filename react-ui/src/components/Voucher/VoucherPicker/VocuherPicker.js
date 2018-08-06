import React from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { MenuItem } from 'material-ui';

import Voucher from '../VoucherBuilder';
import { Link } from 'react-router-dom';
import { getVoucherByNumber } from '../../../reducers/vouchers';
import {
  fetchVouchersByNumber,
  fetchCurrentBalance,
  updateSelectedVoucher
} from '../../../actions';
import { ImageHolder } from '../../AppStyledComponents';
import { VoucherFold } from '../../../images/index';
import { AutoFillInput } from '../../InputFields';

const toggleLink = link => state => {
  return { [link]: !state.showLink };
};
class VoucherPicker extends React.Component {
  state = {
    showLink: true,
    searchText: '',
    dataSource: [],
    voucherNo: '',
    party: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.vouchersList !== prevState.vouchersList) {
      const value =
        nextProps.vouchersList.length > 0
          ? nextProps.vouchersList.map(voucher => {
              return {
                text: voucher.voucherNo,
                value: (
                  <MenuItem style={{ whiteSpace: 'normal' }}>
                    <p>{`${voucher.voucherNo} (${voucher.partyName})`}</p>
                  </MenuItem>
                )
              };
            })
          : null;
      return {
        dataSource: value !== null ? [...value] : []
      };
    }
    return null;
  }

  debouncedFunction = debounce(() => {
    this.props.fetchVouchersByNumber(this.state.searchText);
  }, 1000);

  hideLink = () => this.setState(toggleLink('showLink'));

  getSelectedVoucherNo = () => {
    const selectedVoucher =
      this.props.vouchersList.length > 0
        ? this.props.vouchersList.filter(voucher => voucher.voucherNo === this.state.searchText)
        : null;
    const tempObj = selectedVoucher ? selectedVoucher[0] : null;
    tempObj &&
      this.setState(
        {
          voucherNo: tempObj.voucherNo,
          ...tempObj
        },
        () => {
          this.props.updateSelectedVoucher(tempObj);
          this.props.fetchCurrentBalance(tempObj.party.refId);
        }
      );
  };
  //TODO: refactore this logic to check if user has stoped typeing(onKeyDown), only fire if the user has stoped typing and seachText is not in store
  handleUpdateInput = input => {
    this.setState({ searchText: input }, () => {
      this.debouncedFunction();
      this.getSelectedVoucherNo();
    });
  };

  render() {
    return (
      <React.Fragment>
        <Voucher.Section>
          {this.state.showLink ? (
            <Link to="#" onClick={this.hideLink}>
              <ImageHolder src={VoucherFold} position="relative" top="7px" left="-3px" />
              + Voucher Ref Number
            </Link>
          ) : (
            <AutoFillInput
              width="22rem"
              hint="Invock"
              labelText="Sales Voucher Ref Number"
              searchText={this.state.searchText}
              dataSource={this.state.dataSource}
              onUpdateInput={input => {
                this.handleUpdateInput(input);
              }}
            />
          )}
        </Voucher.Section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    vouchersList: getVoucherByNumber(state)
  };
};
export default connect(mapStateToProps, {
  fetchCurrentBalance,
  fetchVouchersByNumber,
  updateSelectedVoucher
})(VoucherPicker);
