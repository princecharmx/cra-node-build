import _ from 'lodash';
import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import * as CONSTANTS from '../../../constants';
import { Loader } from '../../../components';
import { getOnShowAddItems, getSavedVouchersSuccess } from '../../../reducers';
import { I_USER_ID, COMPANY_ID } from '../../../constants';
import ListSalesPurchaseCreditDebit from './common/ListSalesPurchaseCreditDebit';
import { storeAccountsName } from '../../../actions';
import { togglePurchaseSalesCreationDrawer } from '../../../actions/vouchers';
import { formatDate } from '../../../utils/index';

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

const AddAccounts = Loadable({
  loader: () => import('../../AddAccount'),
  loading() {
    return <div>Loading...</div>;
  }
});

const AddPurchaseVoucher = Loadable({
  loader: () => import('../add/AddPurchaseContainer'),
  loading() {
    return <div>Loading...</div>;
  }
});

class ListPurchaseVoucher extends Component {
  constructor() {
    super();
    this.state = {
      openAddAccount: false,
      recordPaymentPayload: {
        voucherNo: '',
        issueDate: '',
        receiptVoucherDate: '',
        narration: '',
        paymentMethod: ''
      },
      shareVoucherPayload: {
        shareData: []
      },
      shareVoucherContactsData: {
        contacts: [],
        shareContacts: []
      },

      // new state values
      companyID: cookie.load(COMPANY_ID),
      userID: cookie.load(I_USER_ID),

      // boolean values for checking
      openRecordPaymentDialog: false,
      openShareVoucherDialog: false,
      openAddPurchaseVoucher: false,
      openAddContact: false,
      openAddItems: false,
      allVouchersSelected: false,
      openConfirmDialog: false,
      displaySearch: false,

      filterVouchersKey: 'all',
      paidVouchersCount: 0,
      selectedVouchers: {},
      issueDateObj: {},
      searchText: '',

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
      }
    };
  }

  componentDidMount() {
    this.getPurchaseVouchersData();
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
      this.getPurchaseVouchersData();
    }
  }

  getPurchaseVouchersData() {
    let endDate = formatDate(moment().endOf('day')._d);
    let startDate = this.props.vouchers.getDate.startDate;
    api.fetchVouchersList(this.state.companyID, startDate, endDate, 'purchase').then(data => {
      let unpaidObj = _.find(data, item => item._id === 'unpaid');
      let paidObj = _.find(data, item => item._id === 'paid');

      if (unpaidObj !== undefined) {
        this.setState({
          vouchersList: {
            ...this.state.vouchersList,
            unpaidCount: unpaidObj.count,
            unpaidAmount: unpaidObj.amount,
            unpaid: unpaidObj.documents.length > 0 ? unpaidObj.documents.reverse() : []
          }
        });
      }

      if (paidObj !== undefined) {
        this.setState({
          vouchersList: {
            ...this.state.vouchersList,
            paidCount: paidObj.count,
            paidAmount: paidObj.amount,
            paid: paidObj.documents.length > 0 ? unpaidObj.documents.reverse() : []
          }
        });
      }

      this.setState({
        vouchersData: data,
        filterVouchersKey: 'all'
      });
    });
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
          voucherType="Purchase"
          openVoucherDrawer={this.props.togglePurchaseSalesCreationDrawer}
          // openVoucherDrawer={() =>
          //   this.setState({
          //     openAddPurchaseVoucher: true
          //   })
          // }
          vouchersData={this.state.vouchersData}
          vouchersList={this.state.vouchersList}
        />

        <AddAccounts
          openAddAccount={this.state.openAddAccount}
          getAccounts={() => this.getAccounts()}
          drawerClose={() =>
            this.setState({
              openAddAccount: false
            })
          }
        />
        <AddPurchaseVoucher mode={CONSTANTS.CREATE} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { vouchersUpdateState, vouchers, vouchers: { togglePurchaseSalesAddVoucher } } = state;
  return {
    vouchersUpdateState,
    vouchers,
    togglePurchaseSalesAddVoucher,
    savedVouchersSuccess: getSavedVouchersSuccess(state),
    onShowAddItems: getOnShowAddItems(state)
  };
};

export default connect(mapStateToProps, { storeAccountsName, togglePurchaseSalesCreationDrawer })(
  ListPurchaseVoucher
);
