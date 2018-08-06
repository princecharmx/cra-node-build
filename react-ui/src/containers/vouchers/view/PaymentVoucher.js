import axios from 'axios';
import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';

import { formatDate } from '../../../utils';
import ReceiptAndPayment from './common/ReceiptAndPayment';
import * as CONSTANTS from '../../../constants';
import { Loader } from '../../../components';

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 15px 0px 0px 0px;
`;

export class ViewPaymentVoucher extends Component {
  state = {
    selectedVoucher: null,
    tempVerifiedName: {
      0: {
        name: ''
      }
    },
    tempVerifiedNameIndex: 0,
    showNotes: false,
    notesPayload: '',
    openActions: false,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    companyId: cookie.load(CONSTANTS.COMPANY_ID),
    preparedBy: 'ManojK',
    verifiedBy: '',
    shareVoucherPayload: {
      shareData: []
    },
    shareVoucherContactsData: {
      contacts: [],
      shareContacts: []
    }
  };

  componentDidMount() {
    //  get the voucher data from the API
    this.getVoucherData();
  }

  getVoucherData() {
    const { match } = this.props;
    const { companyId, userId } = this.state;

    const GET_VOUCHER_DATA_URL = `${CONSTANTS.API_URL}/i-companies/${companyId}/vouchers/${
      match.params.voucherID
    }`;

    const accessToken = cookie.load(`${userId}@${companyId}`);

    if (accessToken) {
      axios
        .get(GET_VOUCHER_DATA_URL)
        .then(response => response.data)
        .then(data => {
          this.setState(
            {
              selectedVoucher: data
            },
            () => {
              this.setDefaultValues();
              this.getShareVoucherData();
            }
          );
        })
        .catch(err => console.log(err));
    }
  }

  getShareVoucherData() {
    const { companyId, selectedVoucher } = this.state;
    const GET_SHARE_VOUCHER_DATA_URL = `${CONSTANTS.API_URL}/i-companies/${companyId}/vouchers/${
      selectedVoucher.id
    }/share?businessId=${selectedVoucher.party.refId}`;
    axios
      .get(GET_SHARE_VOUCHER_DATA_URL)
      .then(response => response.data)
      .then(data => {
        this.setState({
          shareVoucherContactsData: {
            contacts: [...data.contacts],
            shareContacts: [...data.shareContacts]
          }
        });
      });
  }

  setDefaultValues() {
    const { selectedVoucher } = this.state;

    let tempDate = new Date();
    let formattedDate = formatDate(tempDate);

    this.setState({
      showNotes: false,
      issueDateObj: tempDate,
      expandRecordPayment: false,
      openShareVoucherDialog: false,
      viewMore: selectedVoucher.itemList.length > 3 ? true : false,
      openRecordPaymentDialog: false,
      recordPaymentPayload: {
        ...this.state.recordPaymentPayload,
        voucherNo: '',
        narration: '',
        paidAmount: '',
        paymentMethod: '',
        billFinalAmount: '',
        issueDate: formattedDate,
        party: selectedVoucher.party,
        dueAmount: selectedVoucher.dueAmount,
        refVoucherId: selectedVoucher.voucherNo,
        billToBusinessId: selectedVoucher.party.refId
      },
      shareVoucherPayload: {
        shareData: []
      },
      notesPayload: {
        ...this.state.notesPayload,
        note: ''
      }
    });
  }

  render() {
    if (!this.state.selectedVoucher) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }
    return <ReceiptAndPayment {...this.props} {...this.state} />;
  }
}

export default ViewPaymentVoucher;
