import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { FlatButton, Chip, MenuItem } from 'material-ui';
import { CardText, CardActions } from 'material-ui/Card';
import * as CONSTANTS from '../../../../constants';
import { getFilteredData, arrayToObject, objectToArray, formatDate } from '../../../../utils';

import {
  storeItems,
  updateVouchers,
  updateVoucherTypes,
  storeBusinessAccounts,
  createRecordPayment
} from '../../../../actions';

import {
  SearchIcon,
  VouchersLogo,
  Disabled,
  Enabled,
  Checked,
  UnChecked,
  Cancel
} from '../../../../images';

import {
  Text,
  Popup,
  Dropdown,
  DateTime,
  StatBox,
  ListItem,
  ItemCell,
  LinkText,
  SearchBar,
  CellContent,
  SearchInput,
  VouchersList,
  ItemTextInput,
  TitleContainer,
  SearchAndStats,
  StatsContainer,
  TextInputField,
  ItemCellContent,
  ListItemsContainer,
  VoucherListOptions,
  VouchersListHeader,
  TitleLeftContainer,
  SelectedVoucherText,
  TitleRightContainer,
  PopupTitleContainer,
  VouchersListContainer,
  PaymentHistoryContainer
} from '../../../../components';

const cardStyles = {
  buttons: {
    padding: '0px',
    textAlign: 'right',
    position: 'relative'
  },
  row: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: '15px 0px 15px 0px'
  },
  chipLabel: {
    fontSize: '14px',
    lineHeight: '30px',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  chipIcon: {
    width: '22px',
    height: '22px',
    cursor: 'pointer'
  },
  chip: {
    margin: '4px'
  }
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px 0px 0px 0px;
`;

const Button = styled.button`
  height: 30px;
  display: flex;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 20px;
  text-align: center;
  align-items: center;
  border-radius: 100px;
  text-decoration: none;
  justify-content: center;
  background-color: #27d466;
  border: 1px solid #27d466;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  &:hover {
    box-shadow: none;
    transition: box-shadow 600ms none;
  }
  &:focus {
    outline: none;
  }
`;

const StyledImg = styled.img`
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  padding-right: ${p => (p.padding === 'right' ? '5px' : '0px')};
`;

const PopupRow = styled.div`
  display: flex;
  padding-top: 10px;
  aling-items: flex-start;
  justify-content: space-between;
`;

const ImageHolder = styled.img`
  background-color: transparent;
  width: ${p => (p.width ? p.width : '30px')};
  height: ${p => (p.height ? p.height : '30px')};
  cursor: ${p => (p.cursor ? p.cursor : 'pointer')};
`;

const ShareContactSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${p => p.padding === 'left' && `padding-left: 20px;`};
`;

const ShareContactsField = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ContactCard = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  justify-content: flex-start;
`;

const ContactInfo = styled.div`
  line-height: 20px;
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

const ListItemsAndInputField = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

const ShareListHeader = styled.div`
  color: #868686;
  font-size: 14px;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
`;

const SharedListFlexItem = styled.div`
  display: flex;
  line-height: 30px;
  align-items: center;
  justify-content: space-between;
  ${p =>
    p.type === 'access' &&
    `
    padding-left: 20px;
  `};
`;

const SharedListContactCard = SharedListFlexItem.extend`
  padding: 10px 0px 0px 0px;
`;

const SharedListContactText = styled.div`
  margin-left: 10px;
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

// eslint-disable-next-line
const EmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PhoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;

class ListSalesPurchaseCreditDebitVoucher extends Component {
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
      totalAmountPaid: '',
      // new state values
      companyID: cookie.load(CONSTANTS.COMPANY_ID),
      userID: cookie.load(CONSTANTS.I_USER_ID),

      // boolean values for checking
      openRecordPaymentDialog: false,
      openShareVoucherDialog: false,
      openAddSalesVoucher: false,
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
    this.getFilteredVouchers('all');
  }

  getFilteredVouchers(key) {
    switch (key) {
      case 'unpaid':
        return [...this.props.vouchersList.unpaid];
      case 'paid':
        return [...this.props.vouchersList.paid];
      default:
      case 'all':
        return [...this.props.vouchersList.unpaid, ...this.props.vouchersList.paid];
    }
  }

  handlePaymentClick() {
    let paidVouchersCheck = _.some(
      objectToArray(this.state.selectedVouchers),
      item => item.status === 'Paid'
    );

    let unpaidVouchers =
      _.filter(this.state.selectedVouchers, item => item.status !== 'Paid') || [];

    if (paidVouchersCheck) {
      // remove paid vouchers from the selectedVouchers
      this.setState({
        paidVouchersCount: _.size(this.state.selectedVouchers) - unpaidVouchers.length,
        selectedVouchers: arrayToObject(unpaidVouchers) || {},
        openConfirmDialog: true
      });
    } else {
      this.setState({
        openRecordPaymentDialog: true
      });
    }
  }

  handleMultipleMoveToChallanClick() {
    const { selectedVouchers, companyID } = this.state;

    let tempArray = _.map(selectedVouchers, item => item.party.name);
    tempArray = _.uniq(tempArray);

    const MULTI_VOUCHER_MOVE_URL = `${
      CONSTANTS.API_URL
    }/i-companies/${companyID}/vouchers/type/schallan`;

    if (tempArray.length === 1) {
      let voucherIds = _.map(selectedVouchers, item => item._id);

      axios.put(MULTI_VOUCHER_MOVE_URL, voucherIds).then(response => {
        this.props.updateVoucherTypes(!this.props.voucherTypesUpdateState);
        this.props.updateVouchers(!this.props.vouchersUpdateState);
      });
    } else {
      alert(
        ' you have selected vouchers for two parties \n Please select voucher for a single party '
      );
    }
  }

  handleConvertChallanToSalesClick() {
    const { selectedVouchers, companyID } = this.state;
    const branchId = this.props.currentCompany.primaryBranchId;

    // TODO
    // this will eventually come from UI but for demo
    // generating automatically with default values
    let salesPayload = {
      issueDate: new Date(),
      narration: '',
      notifyParty: false,
      readLockEnabled: false,
      updateLockEnabled: false,
      status: 'unpaid',
      billFinalAmount: 0, // sum of all challans
      party: null,
      voucherList: [],
      preparedBy: null,
      refAccountId: 'get sales account from backend for demo'
    };

    const map = _.map;
    const uniq = _.uniq;
    map(selectedVouchers, voucher => {
      const voucherSummaryObj = {
        refVoucherId: voucher._id,
        voucherNo: voucher.voucherNo,
        amount: voucher.billFinalAmount,
        date: voucher.issueDate || voucher.createdAt
      };
      salesPayload.voucherList.push(voucherSummaryObj);
      salesPayload.billFinalAmount += voucher.billFinalAmount;

      const party = {
        refId: voucher.party.refId,
        address: voucher.party.address,
        state: 'MH',
        gstin: voucher.party.gstin,
        name: voucher.party.name,
        refAccountId: null,
        refAccountName: voucher.party.accountName,
        refAccountGroupName: voucher.party.name + ' (debtor)',
        refPath: 'primary/current-assets/sundry-debtors',
        gstPartyType: voucher.party.gstPartyType
      };

      salesPayload.party = party;
    });
    // i-companies/{id}/i-branches/{fk}/vouchers/sales/challan-list
    const CHALLAN_TO_SALE_URL = `${
      CONSTANTS.API_URL
    }/i-companies/${companyID}/i-branches/${branchId}/vouchers/${
      CONSTANTS.VOUCHER_TYPE_SALES
    }/challan-list`;

    // ensure all selected vouchers belong to same party
    let tempArray = map(selectedVouchers, item => item.party.name);
    tempArray = uniq(tempArray);
    if (tempArray.length === 1) {
      axios.post(CHALLAN_TO_SALE_URL, salesPayload).then(response => {
        this.props.updateVoucherTypes(!this.props.voucherTypesUpdateState);
        this.props.updateVouchers(!this.props.vouchersUpdateState);
      });
    } else {
      alert(
        ' you have selected vouchers for two parties \n Please select voucher for a single party '
      );
    }
  }

  renderConfirmDialog() {
    const renderConfirmDialogButtons = [];

    return (
      <Popup
        label=""
        popupWidth="400px"
        popupButtons={renderConfirmDialogButtons}
        openPopup={this.state.openConfirmDialog}
      >
        <CardText expandable={true} style={{ padding: '0px' }}>
          Unselecting {this.state.paidVouchersCount} paid vouchers from the selected list
        </CardText>

        <CardActions expandable={true} style={cardStyles.buttons}>
          <FlatButton
            label="Continue"
            primary={true}
            onClick={() => {
              this.setState({
                openConfirmDialog: false,
                openRecordPaymentDialog: true
              });
            }}
          />
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={() => {
              this.setState({
                openConfirmDialog: false
              });
            }}
          />
        </CardActions>
      </Popup>
    );
  }

  calculateTotalPaidAmount() {
    const add = (a, b) => a + b;
    const amountPaid = _.map(this.state.selectedVouchers, items => parseFloat(items.totalAmount));
    const totalAmountPaid = amountPaid.reduce(add).toFixed(2);
    this.setState({
      totalAmountPaid: totalAmountPaid
    });
  }

  recordPaymentSubmitClick() {
    const voucherList = _.map(this.state.selectedVouchers, items => {
      return {
        refVoucherId: items._id,
        voucherNo: items.voucherNo,
        paidAmount: items.totalAmount
      };
    });
    const party = _.map(this.state.selectedVouchers, (item, index) => {
      return {
        party: item.party
      };
    });
    const filterParty = arrayToObject(...party);
    const filteredRecordPaymentPayload = _.omit(
      this.state.recordPaymentPayload,
      'receiptVoucherDate'
    );

    const payload = {
      ...filterParty,
      ...filteredRecordPaymentPayload,
      voucherList,
      internalNotes: '',
      billFinalAmount: this.state.totalAmountPaid,
      paidAmount: this.state.totalAmountPaid,
      verifiedBy: []
    };
    this.props
      .createRecordPayment(payload)
      .then(response => response.data)
      .then(data => {
        this.setState({
          openRecordPaymentDialog: false,
          recordPaymentPayload: {
            ...this.state.recordPaymentPayload,
            voucherNo: false
          }
        });
        this.getSalesVouchersData();
        // this.props.updateVoucherList(!this.props.voucherTypesUpdateState);
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  renderRecordPaymentDialog() {
    const recordPaymentDialogActions = [
      <FlatButton
        label="Record"
        primary={true}
        style={{
          marginRight: '0px !important',
          margin: '0px 0px 0px 0px !important'
        }}
        onClick={() => this.recordPaymentSubmitClick()}
      />
    ];

    const recordPaymentDialogTitle = (
      <PopupTitleContainer>
        <SelectedVoucherText fontSize="18px">Payments</SelectedVoucherText>
        <StyledImg
          src={Cancel}
          height="12px"
          width="12px"
          onClick={() => this.setState({ openRecordPaymentDialog: false })}
        />
      </PopupTitleContainer>
    );

    return (
      <Popup
        popupWidth="650px"
        label={recordPaymentDialogTitle}
        popupButtons={recordPaymentDialogActions}
        openPopup={this.state.openRecordPaymentDialog}
      >
        <PaymentHistoryContainer>
          <CardText expandable={true} style={{ padding: '0px' }}>
            <PopupRow>
              <TextInputField
                width="130px"
                labelText="Voucher Type"
                labelSize="2%"
                readOnly={true}
                value="Recipt Voucher"
                underline={false}
              />

              <TextInputField
                width="130px"
                labelSize="2%"
                hint="Voucher No"
                labelText="Voucher No"
                value={this.state.recordPaymentPayload.voucherNo}
                onChange={value => {
                  this.setState({
                    recordPaymentPayload: {
                      ...this.state.recordPaymentPayload,
                      voucherNo: value.toUpperCase()
                    }
                  });
                }}
              />
              <DateTime
                hint="Date"
                width="130px"
                labelText="Date"
                value={this.state.issueDateObj}
                onChange={date => {
                  let tempDate = formatDate(date);

                  this.setState({
                    issueDateObj: date,
                    recordPaymentPayload: {
                      ...this.state.recordPaymentPayload,
                      issueDate: tempDate
                    }
                  });
                }}
              />
            </PopupRow>

            {_.map(this.state.selectedVouchers, (item, index) => (
              <PopupRow key={index}>
                <TextInputField
                  width="130px"
                  labelText="Against Voucher"
                  labelSize="2%"
                  readOnly={true}
                  value={item.voucherNo}
                  underline={false}
                />

                <TextInputField
                  width="130px"
                  labelSize="2%"
                  labelText="Amount Due"
                  readOnly={true}
                  value={parseFloat(item.dueAmount).toFixed(2)}
                  underline={false}
                />

                <TextInputField
                  width="130px"
                  labelSize="2%"
                  hint="Amount"
                  labelText="Amount Paid"
                  value={item.totalAmount}
                  errorText={item.totalAmount > item.dueAmount ? 'Amount exceded due amount' : ''}
                  onChange={value => {
                    this.setState(
                      {
                        selectedVouchers: {
                          ...this.state.selectedVouchers,
                          [index]: {
                            ...this.state.selectedVouchers[index],
                            totalAmount: value
                          }
                        }
                      },
                      this.calculateTotalPaidAmount
                    );
                  }}
                />
              </PopupRow>
            ))}
            <PopupRow>
              <TextInputField
                width="130px"
                labelText="Total Amount Paid"
                labelSize="2%"
                readOnly={true}
                value={!isNaN(this.state.totalAmountPaid) ? this.state.totalAmountPaid : ''}
                underline={false}
              />
            </PopupRow>
            <PopupRow>
              <Dropdown
                width="180px"
                labelSize="2%"
                labelText="Payment Method"
                value={this.state.recordPaymentPayload.paymentMethod}
                onChange={value => {
                  this.setState({
                    recordPaymentPayload: {
                      ...this.state.recordPaymentPayload,
                      paymentMethod: value
                    }
                  });
                }}
              >
                <MenuItem value="Cash" primaryText="Cash" />
                <MenuItem value="Cheque" primaryText="Cheque" />
                <MenuItem value="Bank Transfer" primaryText="Bank Transfer" />
              </Dropdown>

              <TextInputField
                width="350px"
                hint="Invock"
                labelSize="2%"
                labelText="Narration"
                value={this.state.recordPaymentPayload.narration}
                onChange={value => {
                  this.setState({
                    recordPaymentPayload: {
                      ...this.state.recordPaymentPayload,
                      narration: value
                    }
                  });
                }}
              />
            </PopupRow>
          </CardText>

          {/* <CardActions expandable={true} style={cardStyles.buttons}>
            <FlatButton
              label="Record"
              primary={true}
              style={{
                marginRight: '0px !important',
                margin: '0px 0px 0px 0px !important'
              }}
              onClick={() => recordPaymentSubmitClick(this.state)}
            />
          </CardActions> */}
        </PaymentHistoryContainer>
      </Popup>
    );
  }

  renderSearchAndStats() {
    // TODO hack for challan to show inprogress and ready state
    const unSettledStatusName = this.props.voucherType === 'Challan' ? 'InProgress' : 'Unpaid';
    const settledStatusName = this.props.voucherType === 'Challan' ? 'Ready' : 'Paid';
    return (
      <SearchAndStats>
        {!this.state.displaySearch && (
          <SearchBar onClick={() => this.setState({ displaySearch: true })}>
            <StyledImg src={SearchIcon} height="16px" width="16px" padding="right" />
            <Text fontSize="14px" color="#95989A">
              Search vouchers by 'Party Name'
            </Text>
          </SearchBar>
        )}
        {this.state.displaySearch && (
          <SearchInput
            autoFocus={true}
            onBlur={() => {
              if (this.state.searchText === '') {
                this.setState({
                  displaySearch: false
                });
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                this.setState({
                  searchText: '',
                  displaySearch: false
                });
              }
            }}
            onChange={e => this.setState({ searchText: e.target.value })}
          />
        )}

        <StatsContainer>
          <StatBox
            onClick={() => this.setState({ filterVouchersKey: 'all' })}
            bgColor={this.state.filterVouchersKey === 'all' ? '#f9f9fb' : 'transparent'}
          >
            {this.props.vouchersList.paidAmount && (
              <Text fontSize="14px" color="#000000">
                {' '}
                {`Rs ${parseFloat(
                  this.props.vouchersList.paidAmount + this.props.vouchersList.unpaidAmount
                ).toFixed(2)}`}{' '}
              </Text>
            )}
            <Text fontSize="14px" color="#428BCA" paddingTop="15px">
              {' '}
              {`Total (${this.props.vouchersList.paidCount +
                this.props.vouchersList.unpaidCount})`}{' '}
            </Text>
          </StatBox>

          <StatBox
            onClick={() => this.setState({ filterVouchersKey: 'unpaid' })}
            bgColor={this.state.filterVouchersKey === 'unpaid' ? '#f9f9fb' : 'transparent'}
          >
            {this.props.vouchersList.paidAmount && (
              <Text fontSize="14px" color="#000000">
                {' '}
                {`Rs ${parseFloat(this.props.vouchersList.unpaidAmount).toFixed(2)}`}{' '}
              </Text>
            )}
            <Text fontSize="14px" color="#F3B296" paddingTop="15px">
              {' '}
              {`${unSettledStatusName} (${this.props.vouchersList.unpaidCount})`}{' '}
            </Text>
          </StatBox>

          <StatBox
            onClick={() => this.setState({ filterVouchersKey: 'paid' })}
            bgColor={this.state.filterVouchersKey === 'paid' ? '#f9f9fb' : 'transparent'}
          >
            {this.props.vouchersList.paidAmount && (
              <Text fontSize="14px" color="#000000">
                {' '}
                {`Rs ${parseFloat(this.props.vouchersList.paidAmount).toFixed(2)}`}{' '}
              </Text>
            )}
            <Text fontSize="14px" color="#26D367" paddingTop="15px">
              {' '}
              {`${settledStatusName} (${this.props.vouchersList.paidCount})`}{' '}
            </Text>
          </StatBox>
        </StatsContainer>
      </SearchAndStats>
    );
  }

  renderVouchersList() {
    const { match, voucherType } = this.props;

    return (
      <VouchersListContainer>
        {this.props.vouchersList.paid.length + this.props.vouchersList.unpaid.length === 0 ? (
          <VouchersList type="empty">
            <StyledImg src={VouchersLogo} height="100px" width="100px" />
            <Text fontSize="14px" color="#95989A" paddingTop="30px">
              {' '}
              {`You currently don't have any vouchers, click on the '+ Create  ${voucherType} Voucher' to create
              a new ${voucherType} voucher`}{' '}
            </Text>
          </VouchersList>
        ) : (
          <VouchersList>
            {!_.isEmpty(this.state.selectedVouchers) && (
              <VoucherListOptions>
                {/*<Text
                  color="#428BCA"
                  fontSize="16px"
                  marginRight="40px"
                  cursor="pointer"
                  onClick={() => this.handlePaymentClick()}
                >
                  {' '}
                  Payment{' '}
                </Text>
                <Text
                  color="#428BCA"
                  fontSize="16px"
                  marginRight="40px"
                  cursor="pointer"
                  onClick={() =>
                    this.setState({
                      openShareVoucherDialog: true
                    })
                  }
                >
                  {' '}
                  Share{' '}
                </Text> */}
                {this.props.voucherType === 'Sales' && (
                  <Text
                    color="#428BCA"
                    fontSize="16px"
                    marginRight="40px"
                    cursor="pointer"
                    onClick={() => this.handleMultipleMoveToChallanClick()}
                  >
                    {' '}
                    Move To Challan{' '}
                  </Text>
                )}

                {this.props.voucherType === 'Challan' && (
                  <Text
                    color="#428BCA"
                    fontSize="16px"
                    marginRight="40px"
                    cursor="pointer"
                    onClick={() => this.handleConvertChallanToSalesClick()}
                  >
                    {' '}
                    Generate Sales Voucher{' '}
                  </Text>
                )}

                {/* <Text color="#428BCA" fontSize="16px" marginRight="40px" cursor="pointer">
                  {' '}
                  Delete{' '}
                </Text> */}
              </VoucherListOptions>
            )}

            <VouchersListHeader
              paddingTop={_.isEmpty(this.state.selectedVouchers) === true ? '31px' : '0px'}
            >
              <CellContent width="5%">
                <StyledImg
                  width="15px"
                  height="15px"
                  cursor="pointer"
                  src={this.state.allVouchersSelected === true ? Checked : UnChecked}
                  onClick={() => {
                    this.setState(
                      {
                        allVouchersSelected: !this.state.allVouchersSelected
                      },
                      () => {
                        if (this.state.allVouchersSelected === true) {
                          this.setState({
                            selectedVouchers: arrayToObject(
                              this.getFilteredVouchers(this.state.filterVouchersKey)
                            )
                          });
                        } else {
                          this.setState({
                            selectedVouchers: {}
                          });
                        }
                      }
                    );
                  }}
                />
              </CellContent>
              <CellContent fontSize="16px" color="#868686" width="15%">
                {' '}
                Date{' '}
              </CellContent>
              <CellContent fontSize="16px" color="#868686" width="25%">
                {' '}
                Party Name{' '}
              </CellContent>
              <CellContent fontSize="16px" color="#868686" width="17.5%">
                {' '}
                Voucher No{' '}
              </CellContent>
              <CellContent fontSize="16px" color="#868686" width="17.5%">
                {' '}
                Status{' '}
              </CellContent>
              <CellContent fontSize="16px" color="#868686" width="20%">
                {' '}
                Prepared By{' '}
              </CellContent>
            </VouchersListHeader>

            <ListItemsContainer>
              {_.map(
                getFilteredData(
                  this.getFilteredVouchers(this.state.filterVouchersKey),
                  'party',
                  this.state.searchText
                ),
                (item, index) => (
                  <ListItem key={index}>
                    <ItemCell width="5%">
                      <StyledImg
                        width="15px"
                        height="15px"
                        cursor="pointer"
                        src={
                          _.find(this.state.selectedVouchers, item) !== undefined
                            ? Checked
                            : UnChecked
                        }
                        onClick={() => {
                          if (_.find(this.state.selectedVouchers, item) === undefined) {
                            this.setState({
                              selectedVouchers: {
                                ...this.state.selectedVouchers,
                                [index]: item
                              }
                            });
                          } else {
                            this.setState(
                              {
                                selectedVouchers: _.omit(this.state.selectedVouchers, index)
                              },
                              () => {
                                if (
                                  _.size(this.state.selectedVouchers) !==
                                  this.getFilteredVouchers(this.state.filterVouchersKey).length
                                ) {
                                  this.setState({
                                    allVouchersSelected: false
                                  });
                                }
                              }
                            );
                          }
                        }}
                      />
                    </ItemCell>

                    <ItemCell width="15%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {moment(item.createdAt).format('D-M-YYYY') || ''}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="25%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {item.party.name || ''}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="17.5%">
                      <LinkText
                        fontSize="14px"
                        color="#428BCA"
                        cursor="pointer"
                        to={`/${match.params.id}/home/${match.params.page}/${
                          match.params.voucher
                        }/view/${item._id}`}
                      >
                        {' '}
                        {`#${item.voucherNo}`}{' '}
                      </LinkText>

                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {`Rs ${item.billFinalAmount}`}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="17.5%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {this.getStatusToDisplay(voucherType, item.status)}{' '}
                      </ItemCellContent>

                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {`Rs ${parseFloat(item.dueAmount).toFixed(2)}`}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="20%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {_.map(item.preparedBy, item => item.name).join(', ') || ''}{' '}
                      </ItemCellContent>
                    </ItemCell>
                  </ListItem>
                )
              )}
            </ListItemsContainer>
          </VouchersList>
        )}
      </VouchersListContainer>
    );
  }

  // TODO hack for challan to show inprogress and ready state
  getStatusToDisplay(voucherType, voucherStatus) {
    let status = voucherStatus;

    if (voucherType === 'Challan' && voucherStatus.toLowerCase() === 'unpaid') {
      status = 'in-progress';
    } else if (voucherType === 'Challan' && voucherStatus.toLowerCase() === 'paid') {
      status = 'ready';
    }

    return status;
  }
  renderShareVoucherDialog() {
    const shareVoucherDialogActions = [];

    const shareVoucherDialogTitle = (
      <PopupTitleContainer>
        <SelectedVoucherText fontSize="18px">Share Voucher</SelectedVoucherText>
        <ImageHolder
          src={Cancel}
          height="12px"
          width="12px"
          onClick={() => this.setState({ openShareVoucherDialog: false })}
        />
      </PopupTitleContainer>
    );

    return (
      <Popup
        popupWidth="500px"
        label={shareVoucherDialogTitle}
        popupButtons={shareVoucherDialogActions}
        openPopup={this.state.openShareVoucherDialog}
      >
        {this.state.shareVoucherContactsData.contacts > 0 && (
          <CardText style={cardStyles.row}>
            <ShareContactSuggestions>
              {_.map(this.state.shareVoucherContactsData.contacts, contact => (
                <ContactCard key={contact.id}>
                  <ImageHolder
                    width="12px"
                    height="12px"
                    src={
                      _.findIndex(this.state.shareVoucherPayload.shareData, contact) > -1
                        ? Checked
                        : UnChecked
                    }
                    onClick={() => {
                      if (_.findIndex(this.state.shareVoucherPayload.shareData, contact) > -1) {
                        this.setState({
                          shareVoucherPayload: {
                            ...this.state.shareVoucherPayload,
                            shareData: _.without(this.state.shareVoucherPayload.shareData, contact)
                          }
                        });
                      } else {
                        this.setState({
                          shareVoucherPayload: {
                            ...this.state.shareVoucherPayload,
                            shareData: [...this.state.shareVoucherPayload.shareData, contact]
                          }
                        });
                      }
                    }}
                  />
                  <InfoContainer padding="left">
                    <ContactInfo>{contact.name}</ContactInfo>
                    <ContactInfo color="#868686" fontSize="12px">
                      {contact.phone}
                    </ContactInfo>
                  </InfoContainer>
                </ContactCard>
              ))}
            </ShareContactSuggestions>
          </CardText>
        )}

        <CardText style={cardStyles.row}>
          <ShareContactsField>
            <ListItemsAndInputField>
              {_.map(this.state.shareVoucherPayload.shareData, contact => (
                <Chip
                  style={cardStyles.chip}
                  labelStyle={cardStyles.chipLabel}
                  deleteIconStyle={cardStyles.chipIcon}
                  key={contact.id || contact.phone || contact.email}
                  onRequestDelete={() => {
                    this.setState({
                      shareVoucherPayload: {
                        ...this.state.shareVoucherPayload,
                        shareData: _.without(this.state.shareVoucherPayload.shareData, contact)
                      }
                    });
                  }}
                >
                  {contact.name || contact.phone || contact.email}
                </Chip>
              ))}
              <div style={cardStyles.chip}>
                <ItemTextInput
                  field="name"
                  id="addContact"
                  hint="Enter Mobile or Email"
                  containerHeight="30px"
                  containerWidth="125px"
                  value={this.state.shareInputValue}
                  onChange={value => this.setState({ shareInputValue: value })}
                  onKeyUp={e => {
                    let key = '';
                    if (e.key === 'Enter') {
                      if (EmailRegEx.test(this.state.shareInputValue)) {
                        key = 'email';
                      } else if (PhoneRegEx.test(this.state.shareInputValue)) {
                        key = 'phone';
                      }

                      key &&
                        this.setState({
                          shareVoucherPayload: {
                            ...this.state.shareVoucherPayload,
                            shareData: [
                              ...this.state.shareVoucherPayload.shareData,
                              {
                                [key]:
                                  key === 'phone'
                                    ? parseInt(this.state.shareInputValue, 10)
                                    : this.state.shareInputValue
                              }
                            ]
                          },
                          shareInputValue: ''
                        });
                    }
                  }}
                />
              </div>
            </ListItemsAndInputField>
            <FlatButton
              primary={true}
              label="Share"
              onClick={() => this.makePOSTRequestForShareVoucher()}
            />
          </ShareContactsField>
        </CardText>

        {this.state.shareVoucherContactsData.shareContacts.length > 0 && (
          <CardText style={cardStyles.row}>
            <ShareListHeader> Shared List </ShareListHeader>

            {_.map(this.state.shareVoucherContactsData.shareContacts, (contact, key) => (
              <SharedListContactCard key={key}>
                <InfoContainer>
                  {contact.toContactDetail.name && (
                    <ContactInfo> {contact.toContactDetail.name} </ContactInfo>
                  )}

                  {contact.toContactDetail.email && (
                    <ContactInfo color="#868686"> {contact.toContactDetail.email} </ContactInfo>
                  )}

                  {contact.toContactDetail.phone && (
                    <ContactInfo color="#868686" fontSize="12px">
                      {contact.toContactDetail.phone}
                    </ContactInfo>
                  )}
                </InfoContainer>

                <SharedListFlexItem>
                  <SelectedVoucherText color="#428BCA" fontSize="12px">
                    {`${contact.viewCount} views`}
                  </SelectedVoucherText>

                  <SharedListFlexItem type="access">
                    <ImageHolder
                      width="20px"
                      height="16px"
                      cursor="default"
                      src={contact.accessEnabled === true ? Disabled : Enabled}
                    />
                    <SharedListContactText
                      width="73.5px"
                      color="#428BCA"
                      fontSize="12px"
                      cursor="pointer"
                      onClick={() => this.handleAccessToggleClick(contact, key)}
                    >
                      {contact.accessEnabled === true ? 'Disable Access' : 'Enable Access'}
                    </SharedListContactText>
                  </SharedListFlexItem>
                </SharedListFlexItem>
              </SharedListContactCard>
            ))}
          </CardText>
        )}
      </Popup>
    );
  }

  setDurationType() {
    switch (this.props.getVoucherDurationType) {
      case 'month':
        return `Month (${this.props.vouchersList.paidCount + this.props.vouchersList.unpaidCount})`;
      case 'week':
        return `Week (${this.props.vouchersList.paidCount + this.props.vouchersList.unpaidCount})`;
      case 'year':
        return `Year (${this.props.vouchersList.paidCount + this.props.vouchersList.unpaidCount})`;
      default:
      case 'today':
        return `Today (${this.props.vouchersList.paidCount + this.props.vouchersList.unpaidCount})`;
    }
  }

  render() {
    // if (!this.state.vouchersData) {
    //   return (
    //     <Container>
    //       <LoaderContainer>
    //         <Loader />
    //       </LoaderContainer>
    //     </Container>
    //   );
    // }

    return (
      <Container>
        <TitleContainer>
          <TitleLeftContainer>
            <Text fontSize="16px">{`${this.props.voucherType}`}</Text>
            <Text fontSize="18px">{this.setDurationType()}</Text>
          </TitleLeftContainer>

          <TitleRightContainer>
            <Button onClick={this.props.openVoucherDrawer}>
              {`+ Create ${this.props.voucherType} Voucher`}
            </Button>
          </TitleRightContainer>
        </TitleContainer>

        {this.renderSearchAndStats()}

        {this.renderVouchersList()}

        {this.renderConfirmDialog()}

        {this.renderRecordPaymentDialog()}

        {this.renderShareVoucherDialog()}
      </Container>
    );
  }
}

const mapStateToProps = ({
  vouchersUpdateState,
  getVoucherDurationType,
  voucherTypesUpdateState
}) => ({
  vouchersUpdateState,
  getVoucherDurationType,
  voucherTypesUpdateState
});

export default connect(mapStateToProps, {
  storeBusinessAccounts,
  storeItems,
  createRecordPayment,
  updateVouchers,
  updateVoucherTypes
})(ListSalesPurchaseCreditDebitVoucher);
