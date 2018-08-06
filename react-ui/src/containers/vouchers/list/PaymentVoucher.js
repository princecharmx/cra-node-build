import moment from 'moment';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import { formatDate } from '../../../utils';
import { togglePurchaseSalesCreationDrawer } from '../../../actions/vouchers';
import * as CONSTANTS from '../../../constants';
import ListReceiptAndPayment from './common/ReceiptAndPayment';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 30px 0px 0px 0px;
`;

const AddPaymentVoucher = Loadable({
  loader: () => import('../add/AddPaymentContainer'),
  loading() {
    return <div>Loading...</div>;
  }
});

class ListPaymentVoucher extends Component {
  state = {
    companyID: cookie.load(CONSTANTS.COMPANY_ID),
    searchText: '',
    displaySearch: false,
    openAddPaymentVoucher: false
  };

  componentDidMount() {
    // get the receipt vouchers data from the API
    this.getPaymentVouchersData();
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.vouchersUpdateState !== nextProps.vouchersUpdateState ||
      this.props.savedVouchersSuccess !== nextProps.savedVouchersSuccess
    ) {
      this.getPaymentVouchersData();
    }
  }

  getPaymentVouchersData() {
    let endDate = formatDate(moment().endOf('day')._d);
    let startDate = this.props.vouchers.getDate.startDate;

    api.fetchVouchersList(this.state.companyID, startDate, endDate, 'payment').then(data => {
      this.setState({
        totalAmount: data.amount || 0,
        totalCount: data.count || 0,
        vouchersList: data.documents
      });
    });
  }
  render() {
    return (
      <Container>
        <ListReceiptAndPayment
          voucherType="Payment"
          openAddReceiptNote={this.props.togglePurchaseSalesCreationDrawer}
          vouchersList={this.state.vouchersList}
          totalCount={this.state.totalCount}
          totalAmount={this.state.totalAmount}
          {...this.props}
        />

        <AddPaymentVoucher
          openAddDrawer={this.state.openAddPaymentVoucher}
          voucherCloseClick={() => this.setState({ openAddPaymentVoucher: false })}
          drawerOpenAddContact={() => this.setState({ openAddContact: true })}
          getReceiptList={() => this.getPaymentVouchersData()}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ vouchers }) => ({
  vouchers
});
export default connect(mapStateToProps, { togglePurchaseSalesCreationDrawer })(ListPaymentVoucher);
