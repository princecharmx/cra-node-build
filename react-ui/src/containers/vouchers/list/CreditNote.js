import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import { getOnShowAddItems, getSavedVouchersSuccess } from '../../../reducers';
import { togglePurchaseSalesCreationDrawer } from '../../../actions/vouchers';
import * as CONSTANTS from '../../../constants';
import ListSalesPurchaseCreditDebit from './common/ListSalesPurchaseCreditDebit';
import { formatDate, errorObj } from '../../../utils';
import { Loader } from '../../../components';

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

const AddCreditNote = Loadable({
  loader: () => import('../add/AddCreditNoteContainer.js'),
  loading() {
    return <div>Loading...</div>;
  }
});

class ListCreditNote extends Component {
  constructor() {
    super();
    this.state = {
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
      companyID: cookie.load(CONSTANTS.COMPANY_ID),
      userID: cookie.load(CONSTANTS.I_USER_ID),

      // boolean values for checking
      openRecordPaymentDialog: false,
      openShareVoucherDialog: false,
      openAddCreditNote: false,
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
    const accessToken = cookie.load(`${this.state.userID}@${this.state.companyID}`);

    if (accessToken) {
      axios.defaults.headers.common['authorization'] = accessToken || '';

      this.getCreditNoteVouchersData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.vouchersUpdateState !== nextProps.vouchersUpdateState ||
      this.props.savedVouchersSuccess !== nextProps.savedVouchersSuccess
    ) {
      this.getCreditNoteVouchersData();
    }
  }

  getCreditNoteVouchersData() {
    let endDate = formatDate(moment().endOf('day')._d);
    let startDate = this.props.vouchers.getDate.startDate;
    api
      .fetchVouchersList(this.state.companyID, startDate, endDate, 'credit')
      .then(data => {
        let unpaidObj = _.find(data, item => item._id === CONSTANTS.VOUCHER_STATUS_UNPAID);
        let paidObj = _.find(data, item => item._id === CONSTANTS.VOUCHER_STATUS_PAID);

        if (unpaidObj !== undefined) {
          const { documents = [], count, amount } = unpaidObj;
          this.setState({
            vouchersList: {
              ...this.state.vouchersList,
              unpaidCount: count,
              unpaidAmount: amount,
              unpaid: documents
            }
          });
        }

        if (paidObj !== undefined) {
          const { documents = [], count, amount } = paidObj;
          this.setState({
            vouchersList: {
              ...this.state.vouchersList,
              paidCount: count,
              paidAmount: amount,
              paid: documents
            }
          });
        }

        this.setState(
          {
            vouchersData: data,
            filterVouchersKey: CONSTANTS.VOUCHER_TYPE_ALL
          },
          () => this.getFilteredVouchers(CONSTANTS.VOUCHER_TYPE_ALL)
        );
      })
      .catch(errorObj);
  }

  getFilteredVouchers(key) {
    switch (key) {
      case 'unpaid':
        return [...this.state.vouchersList.unpaid];
      case 'paid':
        return [...this.state.vouchersList.paid];
      default:
      case 'all':
        return [...this.state.vouchersList.unpaid, ...this.state.vouchersList.paid];
    }
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
          voucherType="Credit"
          openVoucherDrawer={this.props.togglePurchaseSalesCreationDrawer}
          vouchersData={this.state.vouchersData}
          vouchersList={this.state.vouchersList}
        />

        <AddCreditNote
          updateVoucherList={() => this.getCreditNoteVouchersData()}
          drawerOpenAddContact={() => this.setState({ openAddContact: true })}
          drawerOpenAddItems={() => this.setState({ openAddItems: true })}
          voucherCloseClick={() => this.setState({ openAddCreditNote: false })}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { vouchersUpdateState } = state;
  return {
    vouchersUpdateState,
    onShowAddItems: getOnShowAddItems(state),
    savedVouchersSuccess: getSavedVouchersSuccess(state)
  };
};

export default connect(mapStateToProps, { togglePurchaseSalesCreationDrawer })(ListCreditNote);
