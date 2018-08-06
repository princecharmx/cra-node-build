//TODO: clean this component after demo, functionality should be handled through actions
import _ from 'lodash';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Drawer, MenuItem } from 'material-ui';
import React, { Component } from 'react';

import { arrayToObject } from '../../../utils';
import * as api from '../../../api/vouchers';
import {
  updateVoucherTypes,
  createReceiptVoucher,
  fetchReceiptPaymentAccounts,
  togglePurchaseSalesCreationDrawer
} from '../../../actions';
import { COMPANY_ID } from '../../../constants';
import {
  getIssueDate,
  getParty,
  getVoucherType,
  getopenAddDrawer,
  getUnpaidVouchersList,
  getSelectedAccountDetails,
  getselectedBusinessAccount,
  getbusinessAccountsSuggestions
} from '../../../reducers';
import { AgainstVoucher } from '../../../images';
import * as CONSTANTS from '../../../constants';
//import AddRPVoucher from './common/AddRPVoucher';
import { TextInputField } from '../../../components';
import AddVoucherLayoutRP from './common/AddVoucherLayoutRP';
import Voucher from '../../../components/Voucher/VoucherBuilder';
import { HorizontalBlock } from '../../../components/Voucher/AddVoucherStyledComponents';
import AgainsVoucherDailog from '../../../components/Voucher/addRPComponent/AgainstVoucherDialog';
import {
  RenderParty,
  RenderVoucherDetails,
  AgainstVoucherContainer,
  ImageHolder,
  Title,
  SubTitle,
  IconHolder
} from '../../../components/Voucher/AddVoucherCommon';

const AlignFeilds = styled.div`
  padding: 5px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const RenderTransactionDetails = ({ receviedAmount, updateReceivedAmount }) => {
  return (
    <React.Fragment>
      <Voucher.SectionTitle>Transaction Details</Voucher.SectionTitle>
      <AlignFeilds>
        <TextInputField
          width="250px"
          labelSize="2%"
          labelText="Received Amount"
          value={receviedAmount}
          onChange={value => updateReceivedAmount(value)}
        />
      </AlignFeilds>
    </React.Fragment>
  );
};
const RenderAddAdditionalCharges = ({ onClick, selectedVouchers, receviedAmount }) => {
  return (
    <AgainstVoucherContainer
      onClick={onClick}
      type={_.size(selectedVouchers) > 0 ? 'spread' : null}
    >
      <IconHolder>
        <ImageHolder src={AgainstVoucher} />
        <Title>Against Voucher</Title>
      </IconHolder>
      {_.size(selectedVouchers) > 0 ? (
        <AgainstVoucherDetails
          receviedAmount={receviedAmount}
          selectedVouchers={selectedVouchers}
        />
      ) : (
        <SubTitle>- Payments received and recorded in parties accounts</SubTitle>
      )}
    </AgainstVoucherContainer>
  );
};

const AgainstVoucherDetails = ({ selectedVouchers, receviedAmount }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '51%'
    }}
  >
    {_.map(selectedVouchers, (item, index) => (
      <HorizontalBlock key={`${index}12#AgainstVouch`}>
        <TextInputField
          readOnly
          underline={false}
          width="150px"
          labelSize="2%"
          hint="Select unpaid vouchers"
          labelText="Voucher No"
          value={item.voucherNo}
        />

        <TextInputField
          readOnly
          underline={false}
          width="150px"
          labelSize="2%"
          hint="Pls select unpaid vouchers"
          labelText="Pay Amount"
          value={item.paidAmount}
        />
      </HorizontalBlock>
    ))}
  </div>
);
class AddReceiptContainer extends Component {
  state = {
    onHideDrawer: false,
    receviedAmount: '',
    companyId: cookie.load(COMPANY_ID),
    resetToDefaultState: false,
    selectedVouchers: {},
    totalAmountPaid: '',
    addPayload: {
      paymentMethod: 'cash',
      adjustmentMethod: 'Against Voucher',
      internalNotes: '',
      issueDate: '',
      narration: '',
      verifiedBy: '',
      voucherNo: ''
    }
  };

  resetSelectedVouchers = () => {
    this.setState({ selectedVouchers: {} });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.populateVouchersData && Object.keys(nextProps.populateVouchersData).length > 0) {
      let editableVoucherData = _.map(nextProps.populateVouchersData.voucherList, voucher => {
        return {
          voucherNo: voucher.voucherNo,
          paidAmount: voucher.paidAmount
        };
      });

      this.setState(
        {
          editableVoucherData,
          totalAmountPaid: nextProps.populateVouchersData.billFinalAmount,
          searchText: nextProps.populateVouchersData.party.accountName,
          addPayload: {
            ...this.state.addPayload,
            voucherNo: nextProps.populateVouchersData.voucherNo,
            narration: nextProps.populateVouchersData.narration,
            paymentMethod: nextProps.populateVouchersData.paymentMethod
          },
          selectedBusinessAccount: {
            ...this.state.selectedAccount,
            address: nextProps.populateVouchersData.party.address,
            aliasName: nextProps.populateVouchersData.party.aliasName
          }
        },
        () => {
          this.getSelectedAccountDetails();
          this.populateBusinessAccountSuggestions();
          this.populateUnpaidVoucher();
        }
      );
    }
    if (this.props.resetToDefaultState !== nextProps.resetToDefaultState) {
      this.resetToDefaultState();
    }

    if (
      this.props.contacts &&
      this.props.contacts.contactList.length < nextProps.contacts.contactList.length
    ) {
      this.populateContactsDetails(nextProps);
    }
  }

  populateContactsDetails(nextProps) {
    let newContact = nextProps.contacts.contactList.reverse()[0];
    this.setState(
      {
        selectedBusinessAccount: newContact,
        payload: {
          ...this.state.payload,
          billToBusinessId: newContact.id
        },
        party: {
          ...this.state.party,
          refId: newContact.id,
          name: newContact.name,
          gstin: newContact.gstin !== '' ? newContact.gstin : newContact.pancard,
          address: newContact.address,
          accountName: newContact.name,
          gstPartyType: newContact.gstBusinessType
        }
      },
      () => this.populateShippingAddress(newContact)
    );
  }

  populateShippingAddress(newContact) {
    if (this.state.addressCheck) {
      this.setState({
        shippingAddress: {
          ...this.state.shippingAddress,
          city: newContact.city || '',
          state: newContact.state || '',
          address: newContact.address || '',
          pincode: newContact.pincode || '',
          country: 'India'
        }
      });
    }
    this.setShippingAddress();
  }

  autoPopulateState(nextProps) {
    let editableVoucherData = _.map(nextProps.populateVouchersData.voucherList, voucher => {
      return {
        voucherNo: voucher.voucherNo,
        paidAmount: voucher.paidAmount
      };
    });

    this.setState(
      {
        editableVoucherData,
        totalAmountPaid: nextProps.populateVouchersData.billFinalAmount,
        searchText: nextProps.populateVouchersData.party.accountName,
        addPayload: {
          ...this.state.addPayload,
          voucherNo: nextProps.populateVouchersData.voucherNo,
          narration: nextProps.populateVouchersData.narration,
          paymentMethod: nextProps.populateVouchersData.paymentMethod
        },
        selectedBusinessAccount: {
          ...this.state.selectedAccount,
          address: nextProps.populateVouchersData.party.address,
          aliasName: nextProps.populateVouchersData.party.aliasName
        }
      },
      () => {
        this.getSelectedAccountDetails();
        this.populateBusinessAccountSuggestions();
        this.populateUnpaidVoucher();
      }
    );
  }

  populateUnpaidVoucher() {
    let editableVoucherData = this.state.editableVoucherData;
    let val = _.filter(
      this.state.unpaidVouchers,
      (item, index) =>
        _.indexOf(_.map(editableVoucherData, item => item.voucherNo), item.voucherNo) !== -1
    );
    let value = _.merge(val, editableVoucherData);
    this.setState({
      selectedVouchers: value
    });
  }

  handleAddVerifiedBy() {
    let filteredItem = _.find(
      this.props.teamMembersData,
      item => item.id === this.state.selectedUserId
    );

    if (
      _.find(this.state.verifiedBy, item => item.refId === this.state.selectedUserId) !== undefined
    ) {
      this.setState({
        selectedUserId: ''
      });
    } else {
      this.setState({
        verifiedBy: {
          ...this.state.verifiedBy,
          [this.state.verifiedByIndex + 1]: {
            refId: filteredItem.id,
            name: filteredItem.name
          }
        },
        selectedUserId: '',
        verifiedByIndex: this.state.verifiedByIndex + 1
      });
    }
  }

  populateBusinessAccountSuggestions() {
    const { businessAccountsData, drawerOpenAddContact } = this.props;
    const value = _.map(businessAccountsData, item => {
      return {
        text: item.aliasName,
        value: item.aliasName
      };
    });
    const addItems = {
      text: `${this.state.searchText}`,
      value: (
        <MenuItem
          onClick={drawerOpenAddContact}
          style={{ color: 'blue' }}
          primaryText={`Add Contacts ${this.state.searchText} +`}
        />
      )
    };

    this.setState({
      businessAccountsSuggestions: [...value, addItems]
    });
  }

  getSelectedAccountDetails() {
    const { businessAccountsData } = this.props;

    let selectedAccount = _.filter(
      businessAccountsData,
      item => item.aliasName === this.state.searchText
    );

    if (selectedAccount.length > 0) {
      let tempObj = selectedAccount[0];

      this.setState(
        {
          selectedBusinessAccount: tempObj,
          party: {
            ...this.state.party,
            refId: tempObj.id,
            name: tempObj.name,
            gstin: tempObj.gstin !== '' ? tempObj.gstin : tempObj.pancard,
            address: tempObj.address,
            accountName: tempObj.aliasName,
            gstPartyType: tempObj.gstBusinessType
          }
        },
        () => {
          this.getCurrentBalance();
          this.getUnpaidVouchers();
        }
      );
    }
  }

  getCurrentBalance() {
    api.currentBalance(this.state.companyId, this.state.selectedBusinessAccount.id).then(data =>
      this.setState({
        currentBalance: data.currentBalance
      })
    );
  }

  handleOnChecked = () => {
    this.setState(
      {
        allVouchersSelected: !this.state.allVouchersSelected
      },
      () => {
        if (this.state.allVouchersSelected === true) {
          this.setState(
            {
              selectedVouchers: arrayToObject(this.state.unpaidVouchers)
            },
            this.calculateTotalPaidAmount
          );
        }
      }
    );
  };

  handlePayAmountChange = (value, index) => {
    this.setState(
      {
        selectedVouchers: {
          ...this.state.selectedVouchers,
          [index]: {
            ...this.state.selectedVouchers[index],
            paidAmount: parseFloat(value) || ''
          }
        }
      },
      this.calculateTotalPaidAmount
    );
  };

  handleSelectedVoucherClick = (item, index) => {
    //setState for selected voucher
    if (_.find(this.state.selectedVouchers, item) === undefined) {
      this.setState(
        {
          selectedVouchers: {
            ...this.state.selectedVouchers,
            [index]: {
              ...item,
              paidAmount: 0
            }
          }
        },
        this.calculateTotalPaidAmount
      );
    } else {
      this.setState(
        {
          selectedVouchers: _.omit(this.state.selectedVouchers, index)
        },
        () => {
          if (_.size(this.state.selectedVouchers) !== this.props.unpaidVouchers.length) {
            this.setState({
              allVouchersSelected: false
            });
          }
          this.calculateTotalPaidAmount();
        }
      );
    }
  };

  getUnpaidVouchers() {
    const type =
      this.props.VoucherType === CONSTANTS.VOUCHER_TYPE_RECEIPT
        ? CONSTANTS.VOUCHER_TYPE_SALES
        : CONSTANTS.VOUCHER_TYPE_PURCHASE;
    this.props.fetchUnpaidVouchers(type, this.state.selectedBusinessAccount.id);
  }

  toggleOnHideDrawer = () => {
    this.setState(state => ({
      onHideDrawer: !state.onHideDrawer
    }));
  };
  calculateTotalPaidAmount() {
    let totalAmountPaid;
    if (this.state.allVouchersSelected) {
      totalAmountPaid = _.map(this.props.unpaidVouchers, items => items.paidAmount).reduce(
        (a, b) => parseFloat(a) + parseFloat(b)
      );
    }
    totalAmountPaid = _.map(this.state.selectedVouchers, items => items.paidAmount).reduce(
      (a, b) => parseFloat(a) + parseFloat(b)
    );
    this.setState({
      totalAmountPaid: totalAmountPaid
    });
  }

  resetToDefaultState() {
    this.setState({
      selectedVouchers: {},
      dueDateObj: {},
      issueDateObj: {},
      addressCheck: false,
      totalAmountPaid: '',
      currentBalance: null,
      addVoucherValidations: {},
      voucherItemsSuggestions: [],
      unpaidVouchers: [],
      allVouchersSelected: false,
      payload: {},
      addPayload: {
        paymentMethod: '',
        adjustmentMethod: 'Against Voucher',
        internalNotes: '',
        issueDate: '',
        narration: '',
        verifiedBy: '',
        voucherNo: ''
      }
    });
  }

  handleSaveButton = () => {
    //TODO: payload should be genrated from selectors
    const payload = {
      //spread party form reducer,
      billFinalAmount: this.state.totalAmountPaid,
      ...this.state.addPayload, // this should be handle through redux
      ...this.props.selectedAccountsDetails,
      party: {
        ...this.props.party
      },
      issueDate: this.props.issueDate,
      voucherList: _.map(this.state.selectedVouchers, (item, index) => {
        return {
          refVoucherId: item.id,
          voucherNo: item.voucherNo,
          amount: item.paidAmount,
          date: item.issueDate
        };
      }),
      paidAmount: this.state.totalAmountPaid,
      verifiedBy: []
    };
    this.props
      .createReceiptVoucher(payload)
      .then(data => {
        this.props.voucherCloseClick();
        this.props.getReceiptList();
        this.props.togglePurchaseSalesCreationDrawer();
        this.props.updateVoucherTypes(!this.props.voucherTypesUpdateState);
        this.setState({
          resetToDefaultState: true
        });
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  };
  handlePayAmountChange = (value, index) => {
    this.setState(
      {
        selectedVouchers: {
          ...this.state.selectedVouchers,
          [index]: {
            ...this.state.selectedVouchers[index],
            paidAmount: parseFloat(value) || ''
          }
        }
      },
      this.calculateTotalPaidAmount
    );
  };

  toggleOnHideDrawer = () => {
    this.setState(state => ({
      onHideDrawer: !state.onHideDrawer
    }));
  };

  handleOnChecked = () => {
    this.setState(
      {
        allVouchersSelected: !this.state.allVouchersSelected
      },
      () => {
        if (this.state.allVouchersSelected === true) {
          this.setState(
            {
              selectedVouchers: arrayToObject(this.state.unpaidVouchers)
            },
            this.calculateTotalPaidAmount
          );
        }
      }
    );
  };

  updateReceivedAmount = value => {
    this.setState({
      receviedAmount: value
    });
  };

  componentDidMount() {
    this.props.fetchReceiptPaymentAccounts();
  }

  render() {
    const { openAddDrawer, businessAccountsSuggestions } = this.props;
    return (
      <React.Fragment>
        <Drawer width="90%" docked={false} open={openAddDrawer} openSecondary={true}>
          <AddVoucherLayoutRP
            renderPartyPicker={() => (
              <RenderParty businessAccountsSuggestions={businessAccountsSuggestions} />
            )}
            renderVoucherDetails={() => <RenderVoucherDetails />}
            renderTransactionDetails={() => (
              <RenderTransactionDetails
                receviedAmount={this.state.receviedAmount}
                updateReceivedAmount={this.updateReceivedAmount}
              />
            )}
            renderAddAdditionalCharges={() => (
              <RenderAddAdditionalCharges
                onClick={this.toggleOnHideDrawer}
                selectedVouchers={this.state.selectedVouchers}
              />
            )}
            renderSummaryBlock={() => (
              <Voucher.SummaryBlock
                contentTitle={'Received Amount'}
                totalText={'Amount'}
                billTaxAmount={this.state.receviedAmount}
                billFinalAmount={this.state.totalAmountPaid}
              />
            )}
            renderNarrationBlock={() => (
              <Voucher.NarrationBlock
                updateNarration={this.props.updateNarration}
                value={this.props.narration}
              />
            )}
            onSave={this.handleSaveButton}
          />
        </Drawer>
        <AgainsVoucherDailog
          receviedAmount={this.state.receviedAmount}
          resetSelectedVouchers={this.resetSelectedVouchers}
          handlePayAmountChange={this.handlePayAmountChange}
          onHideDrawer={this.state.onHideDrawer}
          totalAmountPaid={this.state.totalAmountPaid}
          handleOnChecked={this.handleOnChecked}
          toggleOnHideDrawer={this.toggleOnHideDrawer}
          unPaidVouchers={this.props.unpaidVouchers}
          selectedBusinessAccount={this.state.selectedBusinessAccount}
          allVouchersSelected={this.state.allVouchersSelected}
          selectedVouchers={this.state.selectedVouchers}
          handleSelectedVoucherClick={this.handleSelectedVoucherClick}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { voucherTypesUpdateState } = state;
  return {
    voucherTypesUpdateState,
    type: getVoucherType(state),
    issueDate: getIssueDate(state),
    selectedAccountsDetails: getSelectedAccountDetails(state),
    openAddDrawer: getopenAddDrawer(state),
    party: getParty(state),
    unpaidVouchers: getUnpaidVouchersList(state),
    selectedBusinessAccount: getselectedBusinessAccount(state),
    businessAccountsSuggestions: getbusinessAccountsSuggestions(state)
  };
};

export default connect(mapStateToProps, {
  updateVoucherTypes,
  createReceiptVoucher,
  fetchReceiptPaymentAccounts,
  togglePurchaseSalesCreationDrawer
})(AddReceiptContainer);
