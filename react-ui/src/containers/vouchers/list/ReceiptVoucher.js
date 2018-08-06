import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import { formatDate } from '../../../utils';
import * as CONSTANTS from '../../../constants';
import { togglePurchaseSalesCreationDrawer } from '../../../actions/vouchers';
import ListReceiptAndPayment from './common/ReceiptAndPayment';
import { Loader } from '../../../components';
import { getOnShowAddItems, getSavedVouchersSuccess } from '../../../reducers';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 30px 0px 0px 0px;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Loading() {
  return (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
}

const AddReceiptVoucher = Loadable({
  loader: () => import('../add/AddReceiptContainer'),
  loading: Loading
});

class ListReceiptVoucher extends Component {
  state = {
    totalCount: 0,
    totalAmount: 0,
    searchText: '',
    vouchersList: null,
    displaySearch: false,
    filterVouchersKey: 'all',
    openAddReceiptNote: false,
    companyID: cookie.load(CONSTANTS.COMPANY_ID)
  };

  componentDidMount() {
    // get the receipt vouchers data from the API
    this.getReceiptVouchersData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.vouchersUpdateState !== nextProps.vouchersUpdateState ||
      this.props.savedVouchersSuccess !== nextProps.savedVouchersSuccess
    ) {
      this.getReceiptVouchersData();
    }
  }
  getReceiptVouchersData() {
    let endDate = formatDate(moment().endOf('day')._d);
    let startDate = this.props.vouchers.getDate.startDate;

    api.fetchVouchersList(this.state.companyID, startDate, endDate, 'receipt').then(data => {
      this.setState({
        totalAmount: data.amount || 0,
        totalCount: data.count || 0,
        vouchersList: data.documents
      });
    });
  }

  render() {
    if (!this.state.vouchersList) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }

    return (
      <Container>
        <ListReceiptAndPayment
          voucherType={CONSTANTS.VOUCHER_TYPE_RECEIPT}
          openAddReceiptNote={this.props.togglePurchaseSalesCreationDrawer}
          vouchersList={this.state.vouchersList}
          totalCount={this.state.totalCount}
          totalAmount={this.state.totalAmount}
          {...this.props}
        />

        <AddReceiptVoucher
          openAddDrawer={this.state.openAddReceiptNote}
          voucherCloseClick={() => this.setState({ openAddReceiptNote: false })}
          drawerOpenAddContact={() => this.setState({ openAddContact: true })}
          getReceiptList={() => this.getReceiptVouchersData()}
        />
      </Container>
    );
  }
}

const mapStateToPorps = state => {
  const { vouchersUpdateState, vouchers } = state;
  return {
    vouchers,
    vouchersUpdateState,
    onShowAddItems: getOnShowAddItems(state),
    savedVouchersSuccess: getSavedVouchersSuccess(state)
  };
};
export default connect(mapStateToPorps, { togglePurchaseSalesCreationDrawer })(ListReceiptVoucher);
