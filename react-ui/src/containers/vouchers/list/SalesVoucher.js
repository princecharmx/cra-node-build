import find from 'lodash/find';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import { formatDate, errorObj } from '../../../utils';
import * as CONSTANTS from '../../../constants';
import { togglePurchaseSalesCreationDrawer } from '../../../actions/vouchers';
import { Loader } from '../../../components';
import { getOnShowAddItems, getSavedVouchersSuccess } from '../../../reducers';
import ListSalesPurchaseCreditDebit from './common/ListSalesPurchaseCreditDebit';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 30px 0px 0px 0px;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddSalesVoucher = Loadable({
  loader: () => import('../add/AddSalesContainer'),
  loading() {
    return <div>Loading...</div>;
  }
});

class ListSalesVoucher extends Component {
  constructor() {
    super();
    this.state = {
      companyID: cookie.load(CONSTANTS.COMPANY_ID),
      userID: cookie.load(CONSTANTS.I_USER_ID),
      // vouchers data from the API
      vouchersData: null,

      // for better handling of data, creating a temporary format for the vouchers list
      vouchersList: {
        unpaidAmount: 0,
        unpaidCount: 0,
        paidAmount: 0,
        paidCount: 0,
        unpaid: [],
        paid: []
      },
      openVoucherDrawer: false,
      openAddContact: false,
      openAddItems: false,
      listUpdate: false,
      openAddSalesVoucher: false
    };
  }

  componentDidMount() {
    const accessToken = cookie.load(`${this.state.userID}@${this.state.companyID}`);
    if (accessToken) {
      axios.defaults.headers.common['authorization'] = accessToken || '';

      this.getSalesVouchersData();
    }
    this.getAccounts();
  }

  getAccounts() {
    api
      .fetchIndirectExpensesAccounts(this.state.companyID)
      .then(response => {
        this.props.storeAccountsName(response);
        // TODO: Why is setState used here and no dispatch action
        this.setState({
          accountNames: response
        });
      })
      .catch(error => console.log(error));
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.vouchersUpdateState !== nextProps.vouchersUpdateState ||
      this.props.savedVouchersSuccess !== nextProps.savedVouchersSuccess
    ) {
      this.getSalesVouchersData();
    }
  }

  getSalesVouchersData() {
    let endDate = formatDate(moment().endOf('day')._d);
    let startDate = this.props.vouchers.getDate.startDate;
    api
      .fetchVouchersList(this.state.companyID, startDate, endDate, CONSTANTS.VOUCHER_TYPE_SALES)
      .then(data => {
        let unpaidObj = find(data, item => item._id === 'unpaid');
        let paidObj = find(data, item => item._id === 'paid');

        if (unpaidObj !== undefined) {
          this.setState({
            vouchersList: {
              ...this.state.vouchersList,
              unpaidCount: unpaidObj.count,
              unpaidAmount: unpaidObj.amount,
              unpaid: unpaidObj.documents.length > 0 ? unpaidObj.documents : []
            }
          });
        }

        if (paidObj !== undefined) {
          this.setState({
            vouchersList: {
              ...this.state.vouchersList,
              paidCount: paidObj.count,
              paidAmount: paidObj.amount,
              paid: paidObj.documents.length > 0 ? paidObj.documents : []
            }
          });
        }

        this.setState({
          vouchersData: data,
          listUpdate: !this.state.listUpdate
        });
      })
      .catch(errorObj);
  }

  render() {
    if (!this.state.vouchersData) {
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
        <ListSalesPurchaseCreditDebit
          {...this.props}
          voucherType="Sales"
          openVoucherDrawer={this.props.togglePurchaseSalesCreationDrawer}
          vouchersData={this.state.vouchersData}
          vouchersList={this.state.vouchersList}
        />

        <AddSalesVoucher accountNames={this.state.accountNames} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { vouchersUpdateState, vouchers } = state;
  return {
    vouchersUpdateState,
    vouchers,
    onShowAddItems: getOnShowAddItems(state),
    savedVouchersSuccess: getSavedVouchersSuccess(state)
  };
};

export default connect(mapStateToProps, { togglePurchaseSalesCreationDrawer })(ListSalesVoucher);
