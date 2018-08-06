import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { CardHeader, CardText, CardActions } from 'material-ui/Card';
import { MenuItem, Popover, FlatButton, Menu, Chip } from 'material-ui/';

import * as CONSTANTS from '../constants';
import { getShareVoucherData } from '../actions';
import { Share, PaymentIcon, Cancel, Checked, UnChecked, Enabled, Disabled } from '../images';
import {
  Popup,
  DateTime,
  Dropdown,
  FormBlock,
  SingleRow,
  TextButton,
  ActionBlock,
  DisplayItem,
  SummaryBlock,
  SummaryTitle,
  SummaryValue,
  ItemTextInput,
  TextInputField,
  FormBlockTitle,
  RightHalfContainer,
  SelectedVoucherRow,
  SelectedVoucherText,
  SelectedVoucherBlock,
  DisplayItemsContainer,
  SelectedVoucherActions,
  DisplayHorizontalField
} from '../components';

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

const StyledSpan = styled.span`
  color: #2e6eaf;
  font-size: 15px;
  cursor: pointer;
  font-weight: 400;
  text-align: center;
`;

const NotesOptions = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div`
  width: 300px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const NotesInputFields = styled.div`
  display: flex;
  width: inherit;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DisplayNote = styled.div`
  heigth: 40px;
  display: flex;
  flex-shrink: 0;
  width: inherit;
  margin-top: 5px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const NoteRow = styled.div`
  display: flex;
  width: inherit;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PopupRow = styled.div`
  display: flex;
  padding-top: 10px;
  aling-items: flex-start;
  justify-content: space-between;
`;

const PopupTitleContainer = styled.div`
  margin: 0px;
  display: flex;
  line-height: 32px;
  align-items: center;
  padding: 24px 24px 20px;
  color: rgba(0, 0, 0, 0.87);
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

const ContactCard = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  justify-content: flex-start;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${p => p.padding === 'left' && `padding-left: 20px;`};
`;

const ContactInfo = styled.div`
  line-height: 20px;
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

const ShareContactsField = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

const PaymentHistoryContainer = styled.div`
  margin: 12px 0px 0px 0px;
`;

const PaymentHistoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const PaymentHistoryText = styled.div`
  width: ${p => (p.width ? p.width : '138px')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

// eslint-disable-next-line
const EmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PhoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;

class ViewVoucher extends Component {
  state = {
    anchorEl: {},
    viewMore: false,
    showNotes: false,
    openActions: false,
    shareInputValue: '',
    expandRecordPayment: false,
    openShareVoucherDialog: false,
    openRecordPaymentDialog: false,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    companyId: cookie.load(CONSTANTS.COMPANY_ID),
    notesPayload: {
      note: '',
      byName: cookie.load('userName')
    },
    issueDateObj: {},
    recordPaymentPayload: {
      dueAmount: '',
      issueDate: '',
      narration: '',
      paidAmount: '',
      type: CONSTANTS.VOUCHER_TYPE_RECEIPT,
      voucherNo: '',
      refVoucherId: '',
      paymentMethod: '',
      billToBusinessId: ''
    },
    shareVoucherPayload: {
      shareData: []
    },
    shareVoucherContactsData: {
      contacts: [],
      shareContacts: []
    }
  };

  componentDidMount() {
    const { selectedVoucher } = this.props;

    // sets default values for the voucher
    this.setDefaultValues();

    // get share voucher data from the API
    this.getShareVouchersData(selectedVoucher);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedVoucher } = nextProps;

    if (selectedVoucher.id !== this.props.selectedVoucher.id) {
      this.getShareVouchersData(selectedVoucher);
    }

    if (nextProps.resetRecordPaymentDialog !== this.props.resetRecordPaymentDialog) {
      this.setDefaultValues();
    }

    this.setState({
      showNotes: false,
      viewMore: selectedVoucher.lineItems.length > 3 ? true : false
    });
  }

  getShareVouchersData(selectedVoucher) {
    //remove apis from share voucher
    // remove cookie dependency
    // create an action get companyId from store
    // return succes from action

    this.props.getShareVoucherData.then(data => {
      this.setState({
        shareVoucherContactsData: {
          contacts: [...data.contacts],
          shareContacts: [...data.shareContacts]
        }
      });
    });
  }

  makePOSTRequestForShareVoucher() {
    const { selectedVoucher } = this.props;
    const { shareVoucherPayload, companyId, userId } = this.state;

    const companyAccessToken = cookie.load(`${userId}@${companyId}`);

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      const POST_SHARE_VOUCHER_URL = `${CONSTANTS.API_URL}/i-companies/${companyId}/vouchers/${
        selectedVoucher.id
      }/share`;

      if (shareVoucherPayload.shareData.length > 0) {
        axios
          .post(POST_SHARE_VOUCHER_URL, shareVoucherPayload)
          .then(response => response.data)
          .then(data => {
            this.setState(
              {
                openShareVoucherDialog: false,
                shareVoucherPayload: {
                  shareData: []
                }
              },
              this.getShareVouchersData
            );
          });
      }
    }
  }

  handleAccessToggleClick(sharedContact, key) {
    const { selectedVoucher } = this.props;
    const { userId, companyId } = this.state;
    const companyAccessToken = cookie.load(`${userId}@${companyId}`);

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      const SHARE_ACCESS_LINK_URL = `${CONSTANTS.API_URL}/i-companies/${companyId}/voucher/${
        selectedVoucher.id
      }/status/${sharedContact.id}/disable`;

      let payload = !sharedContact.accessEnabled;

      axios
        .put(SHARE_ACCESS_LINK_URL, payload)
        .then(response => response.data)
        .then(data => {});
    }
  }

  setDefaultValues(recordPaymentBool) {
    const { selectedVoucher } = this.props;

    let tempDate = new Date();
    let formattedDate = JSON.stringify(tempDate).replace('"', '');
    formattedDate = formattedDate.replace('"', '');

    this.setState({
      showNotes: false,
      issueDateObj: tempDate,
      expandRecordPayment: false,
      openShareVoucherDialog: false,
      viewMore: selectedVoucher.lineItems.length > 3 ? true : false,
      openRecordPaymentDialog: recordPaymentBool === 'closeRecordPayment' ? true : false,
      recordPaymentPayload: {
        ...this.state.recordPaymentPayload,
        voucherNo: '',
        narration: '',
        paidAmount: '',
        paymentMethod: '',
        issueDate: formattedDate,
        dueAmount: selectedVoucher.dueAmount,
        refVoucherId: selectedVoucher.voucherNo,
        billToBusinessId: selectedVoucher.billToBusinessId
      }
    });
  }

  renderShareVoucherDialog() {
    const shareVoucherDialogActions = [];

    const shareVoucherDialogTitle = (
      <PopupTitleContainer>
        <SelectedVoucherText fontSize="18px"> Share Voucher </SelectedVoucherText>{' '}
        <ImageHolder
          src={Cancel}
          height="12px"
          width="12px"
          onClick={() =>
            this.setState({
              openShareVoucherDialog: false
            })
          }
        />{' '}
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
                    <ContactInfo> {contact.name} </ContactInfo>{' '}
                    <ContactInfo color="#868686" fontSize="12px">
                      {' '}
                      {contact.phone}{' '}
                    </ContactInfo>{' '}
                  </InfoContainer>{' '}
                </ContactCard>
              ))}{' '}
            </ShareContactSuggestions>{' '}
          </CardText>
        )}
        <CardText style={cardStyles.row}>
          <ShareContactsField>
            <ListItemsAndInputField>
              {' '}
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
                  {' '}
                  {contact.name || contact.phone || contact.email}{' '}
                </Chip>
              ))}{' '}
              <div style={cardStyles.chip}>
                <ItemTextInput
                  field="name"
                  id="addContact"
                  hint="Add a contact"
                  containerHeight="30px"
                  containerWidth="125px"
                  value={this.state.shareInputValue}
                  onChange={value =>
                    this.setState({
                      shareInputValue: value
                    })
                  }
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
                />{' '}
              </div>{' '}
            </ListItemsAndInputField>{' '}
            <FlatButton
              primary={true}
              label="Share"
              onClick={() => this.makePOSTRequestForShareVoucher()}
            />{' '}
          </ShareContactsField>{' '}
        </CardText>
        {this.state.shareVoucherContactsData.shareContacts.length > 0 && (
          <CardText style={cardStyles.row}>
            <ShareListHeader> Shared List </ShareListHeader>
            {_.map(this.state.shareVoucherContactsData.shareContacts, (contact, key) => (
              <SharedListContactCard key={key}>
                <InfoContainer>
                  {' '}
                  {contact.toContactDetail.name && (
                    <ContactInfo> {contact.toContactDetail.name} </ContactInfo>
                  )}
                  {contact.toContactDetail.email && (
                    <ContactInfo color="#868686"> {contact.toContactDetail.email} </ContactInfo>
                  )}
                  {contact.toContactDetail.phone && (
                    <ContactInfo color="#868686" fontSize="12px">
                      {' '}
                      {contact.toContactDetail.phone}{' '}
                    </ContactInfo>
                  )}{' '}
                </InfoContainer>
                <SharedListFlexItem>
                  <SelectedVoucherText color="#428BCA" fontSize="12px">
                    {' '}
                    {`${contact.viewCount} views`}{' '}
                  </SelectedVoucherText>
                  <SharedListFlexItem type="access">
                    <ImageHolder
                      width="20px"
                      height="16px"
                      cursor="default"
                      src={contact.accessEnabled === true ? Disabled : Enabled}
                    />{' '}
                    <SharedListContactText
                      width="73.5px"
                      color="#428BCA"
                      fontSize="12px"
                      cursor="pointer"
                      onClick={() => this.handleAccessToggleClick(contact, key)}
                    >
                      {' '}
                      {contact.accessEnabled === true ? 'Disable Access' : 'Enable Access'}{' '}
                    </SharedListContactText>{' '}
                  </SharedListFlexItem>{' '}
                </SharedListFlexItem>{' '}
              </SharedListContactCard>
            ))}{' '}
          </CardText>
        )}{' '}
      </Popup>
    );
  }

  renderRecordPaymentDialog() {
    const { recordPaymentSubmitClick, selectedVoucher } = this.props;

    const recordPaymentDialogActions = [];

    const recordPaymentDialogTitle = (
      <PopupTitleContainer>
        <SelectedVoucherText fontSize="18px"> Payments </SelectedVoucherText>{' '}
        <ImageHolder
          src={Cancel}
          height="12px"
          width="12px"
          onClick={() =>
            this.setState({
              openRecordPaymentDialog: false
            })
          }
        />{' '}
      </PopupTitleContainer>
    );

    return (
      <Popup
        popupWidth="600px"
        label={recordPaymentDialogTitle}
        popupButtons={recordPaymentDialogActions}
        openPopup={this.state.openRecordPaymentDialog}
      >
        {' '}
        {selectedVoucher.dueAmount !== 0 && (
          <PaymentHistoryContainer>
            <CardText
              expandable={true}
              style={{
                padding: '0px'
              }}
            >
              <PopupRow>
                <TextInputField
                  width="250px"
                  labelSize="2%"
                  readOnly={true}
                  hint="Voucher Type"
                  labelText="Voucher Type"
                  value={this.state.recordPaymentPayload.type}
                  onChange={value => {
                    this.setState({
                      recordPaymentPayload: {
                        ...this.state.recordPaymentPayload,
                        type: value
                      }
                    });
                  }}
                />
                <TextInputField
                  width="250px"
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
                />{' '}
              </PopupRow>
              <PopupRow>
                <TextInputField
                  width="250px"
                  labelSize="2%"
                  readOnly={true}
                  hint="Voucher ID"
                  labelText="Against Voucher"
                  value={this.state.recordPaymentPayload.refVoucherId}
                  onChange={value => {
                    this.setState({
                      recordPaymentPayload: {
                        ...this.state.recordPaymentPayload,
                        refVoucherId: value
                      }
                    });
                  }}
                />
                <TextInputField
                  width="250px"
                  labelSize="2%"
                  readOnly={true}
                  labelText="Amount Due"
                  hint="Due Amount in Rs"
                  value={this.state.recordPaymentPayload.dueAmount}
                  onChange={value => {
                    this.setState({
                      recordPaymentPayload: {
                        ...this.state.recordPaymentPayload,
                        dueAmount: value
                      }
                    });
                  }}
                />{' '}
              </PopupRow>
              <PopupRow>
                <TextInputField
                  width="250px"
                  labelSize="2%"
                  labelText="Amount Paid"
                  hint="Paid Amount in Rs"
                  value={this.state.recordPaymentPayload.paidAmount}
                  onChange={value => {
                    this.setState({
                      recordPaymentPayload: {
                        ...this.state.recordPaymentPayload,
                        paidAmount: parseFloat(value) || ''
                      }
                    });
                  }}
                />
                <DateTime
                  hint="Date"
                  width="250px"
                  labelText="Issue Date"
                  value={this.state.issueDateObj}
                  onChange={date => {
                    let tempDate = JSON.stringify(date).replace('"', '');
                    tempDate = tempDate.replace('"', '');

                    this.setState({
                      issueDateObj: date,
                      recordPaymentPayload: {
                        ...this.state.recordPaymentPayload,
                        issueDate: tempDate
                      }
                    });
                  }}
                />{' '}
              </PopupRow>
              <PopupRow>
                <TextInputField
                  width="250px"
                  labelSize="2%"
                  labelText="Narration"
                  hint="Remarks for the payment voucher"
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
                <Dropdown
                  width="250px"
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
                </Dropdown>{' '}
              </PopupRow>{' '}
            </CardText>
            <CardActions expandable={true} style={cardStyles.buttons}>
              <FlatButton
                label="Record"
                primary={true}
                style={{
                  marginRight: '0px !important',
                  margin: '0px 0px 0px 0px !important'
                }}
                onClick={() => recordPaymentSubmitClick(this.state.recordPaymentPayload)}
              />{' '}
            </CardActions>{' '}
          </PaymentHistoryContainer>
        )}
        {selectedVoucher.paymentHistory &&
          selectedVoucher.paymentHistory.length > 0 && (
            <PaymentHistoryContainer>
              <CardHeader
                title="Payment History"
                actAsExpander={false}
                showExpandableButton={false}
                titleColor="rgba(66, 139, 202, 1)"
                style={{
                  padding: '0px 0px 10px 0px',
                  cursor: 'default'
                }}
              />
              {_.map(selectedVoucher.paymentHistory.reverse(), item => (
                <CardText
                  expandable={false}
                  style={{
                    padding: '10px 0px'
                  }}
                  key={item.paymentVoucherId}
                >
                  <PaymentHistoryRow>
                    <PaymentHistoryText fontSize="14px" color="#868686" width="126px">
                      {' '}
                      {moment(item.timestamp).format('DD-MM-YYYY')}{' '}
                    </PaymentHistoryText>{' '}
                    <PaymentHistoryText fontSize="14px" color="#868686" width="150px">
                      {' '}
                      {item.paymentVoucherNo || 'payment voucher no'}{' '}
                    </PaymentHistoryText>{' '}
                    <PaymentHistoryText fontSize="14px" color="#868686">
                      {' '}
                      {item.paymentMethod || 'payment method'}{' '}
                    </PaymentHistoryText>{' '}
                    <PaymentHistoryText fontSize="14px" color="#868686">
                      {' '}
                      {`Rs ${item.paidAmount}` || 'paid amount'}{' '}
                    </PaymentHistoryText>{' '}
                  </PaymentHistoryRow>{' '}
                </CardText>
              ))}{' '}
            </PaymentHistoryContainer>
          )}{' '}
      </Popup>
    );
  }

  render() {
    const { deleteVoucherClick, selectedVoucher, addNote } = this.props;

    return (
      <RightHalfContainer>
        <SelectedVoucherBlock type="firstRow" padding="tlr">
          <SelectedVoucherRow>
            <SelectedVoucherText fontSize="18px">
              {' '}
              {`${selectedVoucher.type} #${selectedVoucher.voucherNo}`}{' '}
            </SelectedVoucherText>
            <SelectedVoucherActions>
              <ActionBlock
                margin="right"
                onClick={() =>
                  this.setState({
                    openRecordPaymentDialog: true
                  })
                }
              >
                <ImageHolder src={PaymentIcon} width="22px" height="15px" />
                <SelectedVoucherText color="#428BCA" type="empty">
                  Payments{' '}
                </SelectedVoucherText>{' '}
              </ActionBlock>
              <ActionBlock
                margin="right"
                onClick={() =>
                  this.setState({
                    openShareVoucherDialog: true
                  })
                }
              >
                <ImageHolder src={Share} width="22px" height="15px" />
                <SelectedVoucherText color="#428BCA" type="empty">
                  Share{' '}
                </SelectedVoucherText>{' '}
              </ActionBlock>
              <ActionBlock>
                <TextButton
                  label="Actions"
                  color="#428BCA"
                  onClick={event => {
                    // This prevents ghost click
                    event.preventDefault();

                    this.setState({
                      openActions: true,
                      anchorEl: event.currentTarget
                    });
                  }}
                />{' '}
                <Popover
                  open={this.state.openActions}
                  anchorEl={this.state.anchorEl}
                  targetOrigin={{
                    horizontal: 'left',
                    vertical: 'top'
                  }}
                  anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom'
                  }}
                  onRequestClose={() =>
                    this.setState({
                      openActions: !this.state.openActions
                    })
                  }
                >
                  <Menu>
                    <MenuItem primaryText="Download" />
                    <MenuItem primaryText="Print" />
                    <MenuItem primaryText="Delete" onClick={deleteVoucherClick} />{' '}
                  </Menu>{' '}
                </Popover>{' '}
              </ActionBlock>{' '}
            </SelectedVoucherActions>{' '}
          </SelectedVoucherRow>
          <SelectedVoucherRow margin="top">
            <SelectedVoucherText fontSize="15px">
              {' '}
              {`Total Amount: ${selectedVoucher.billFinalAmount}`}{' '}
            </SelectedVoucherText>
            <SelectedVoucherText fontSize="15px">
              {' '}
              {`Balance Due: ${selectedVoucher.dueAmount}`}{' '}
            </SelectedVoucherText>{' '}
          </SelectedVoucherRow>
          <SelectedVoucherRow type="container" margin="top">
            {' '}
            {this.state.showNotes === false ? (
              <SelectedVoucherText
                cursor="pointer"
                color="#428BCA"
                fontSize="15px"
                onClick={() => {
                  this.setState({
                    showNotes: !this.state.showNotes
                  });
                }}
              >
                {' '}
                {selectedVoucher.internalNotes.length > 0
                  ? `Internal Notes ${selectedVoucher.internalNotes.length} found`
                  : 'Add Internal Notes'}{' '}
              </SelectedVoucherText>
            ) : (
              <Container>
                <NotesInputFields>
                  <ItemTextInput
                    field="name"
                    page="showNote"
                    id="internalNote"
                    hint="Add a comment"
                    containerHeight="20px"
                    containerWidth="225px"
                    value={this.state.notesPayload.note}
                    onChange={value => {
                      this.setState({
                        notesPayload: {
                          ...this.state.notesPayload,
                          note: value
                        }
                      });
                    }}
                  />{' '}
                  <NotesOptions>
                    <SelectedVoucherText
                      color="#428BCA"
                      fontSize="14px"
                      cursor="pointer"
                      onClick={() => {
                        addNote(this.state.notesPayload);
                        this.setState({
                          notesPayload: {
                            ...this.state.notesPayload,
                            note: ''
                          }
                        });
                      }}
                    >
                      Add{' '}
                    </SelectedVoucherText>{' '}
                    <ImageHolder
                      src={Cancel}
                      width="10px"
                      height="10px"
                      type="leftPadding"
                      onClick={() => {
                        this.setState({
                          showNotes: !this.state.showNotes
                        });
                      }}
                    />{' '}
                  </NotesOptions>{' '}
                </NotesInputFields>
                {selectedVoucher.internalNotes.length > 0 &&
                  _.map(selectedVoucher.internalNotes.reverse(), (internalNote, index) => (
                    <DisplayNote>
                      <NoteRow>
                        <SelectedVoucherText fontSize="11px" color="#000000">
                          {' '}
                          {internalNote.byName}{' '}
                        </SelectedVoucherText>{' '}
                        <SelectedVoucherText fontSize="10px" color="rgba(0, 0, 0, 0.3)">
                          {' '}
                          {moment(internalNote.timestamp).format('MMM Do, h:m A')}{' '}
                        </SelectedVoucherText>{' '}
                      </NoteRow>
                      <SelectedVoucherText fontSize="11px" color="rgba(0, 0, 0, 0.3)">
                        {' '}
                        {internalNote.note}{' '}
                      </SelectedVoucherText>{' '}
                    </DisplayNote>
                  ))}{' '}
              </Container>
            )}
            <SelectedVoucherText fontSize="15px">
              {' '}
              {`Due Date: ${moment(selectedVoucher.dueDate).format('D-MM-YYYY')}`}{' '}
            </SelectedVoucherText>{' '}
          </SelectedVoucherRow>{' '}
        </SelectedVoucherBlock>
        <SelectedVoucherBlock type="secondRow">
          <FormBlock width="50%">
            <FormBlockTitle fontSize="15px" color="#4A4A4A" fontWeight="400">
              Bill To Address{' '}
            </FormBlockTitle>{' '}
            <DisplayItemsContainer>
              <SelectedVoucherText fontSize="14px" color="#000000" type="address">
                {' '}
                {`${selectedVoucher.billToBusinessName},`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`${selectedVoucher.billToBusinessAddress},`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`${selectedVoucher.billToBusinessCity}, India,`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`Pincode: ${selectedVoucher.billToBusinessPincode},`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`GSTIN: ${selectedVoucher.billToBusinessGstin}.`}{' '}
              </SelectedVoucherText>{' '}
            </DisplayItemsContainer>{' '}
          </FormBlock>
          <FormBlock width="50%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Ship To Address{' '}
            </FormBlockTitle>{' '}
            <DisplayItemsContainer>
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`${selectedVoucher.shippingAddress},`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`${selectedVoucher.shippingCity}, India,`}{' '}
              </SelectedVoucherText>{' '}
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`Pincode: ${selectedVoucher.shippingPincode}`}{' '}
              </SelectedVoucherText>{' '}
            </DisplayItemsContainer>{' '}
          </FormBlock>{' '}
        </SelectedVoucherBlock>
        <SelectedVoucherBlock type="thirdRow">
          <FormBlock width="100%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Items{' '}
            </FormBlockTitle>
            <DisplayItemsContainer>
              <DisplayHorizontalField>
                <DisplayItem
                  width="23%"
                  type="name"
                  color="#4A4A4A"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                >
                  Name{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="12.5%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  HSN{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Tax( % ){' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Qty{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="12.5%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Price / Unit{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Units{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="11%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Discount{' '}
                </DisplayItem>{' '}
                <DisplayItem
                  width="14%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Amount{' '}
                </DisplayItem>{' '}
              </DisplayHorizontalField>
              {_.map(
                this.state.viewMore === true
                  ? selectedVoucher.lineItems.slice(0, 3)
                  : selectedVoucher.lineItems,
                (item, key) => (
                  <DisplayHorizontalField key={key} blockType="content">
                    <DisplayItem
                      width="23%"
                      type="name"
                      fontSize="14px"
                      fontWeight="400"
                      color="#000000"
                    >
                      {' '}
                      {item.itemName}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="12.5%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {item.hsn}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {`${item.lineTaxPercentage} %`}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {item.qty}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="12.5%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {item.unitSellPrice}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {item.unit}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="11%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {`${parseFloat(item.lineDiscount).toFixed(2)} ${item.lineDiscountUnit}`}{' '}
                    </DisplayItem>{' '}
                    <DisplayItem width="14%" fontSize="14px" fontWeight="400" color="#000000">
                      {' '}
                      {`${parseFloat(item.lineAmountAfterTax).toFixed(2)}`}{' '}
                    </DisplayItem>{' '}
                  </DisplayHorizontalField>
                )
              )}
              {selectedVoucher.lineItems.length > 3 && (
                <SingleRow type="viewMore">
                  <StyledSpan
                    onClick={() =>
                      this.setState({
                        viewMore: !this.state.viewMore
                      })
                    }
                  >
                    {' '}
                    {this.state.viewMore === true ? 'View More' : 'View Less'}{' '}
                  </StyledSpan>{' '}
                </SingleRow>
              )}{' '}
            </DisplayItemsContainer>{' '}
          </FormBlock>{' '}
        </SelectedVoucherBlock>
        <SelectedVoucherBlock type="fourthRow">
          <FormBlock width="50%">
            <FormBlockTitle fontSize="15px" color="#4A4A4A" fontWeight="400">
              Tax Breakup{' '}
            </FormBlockTitle>{' '}
            <DisplayItemsContainer />
          </FormBlock>
          <FormBlock width="50%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Summary{' '}
            </FormBlockTitle>{' '}
            <DisplayItemsContainer>
              <SummaryBlock blockType="itemSummary">
                <SummaryTitle> Total Price </SummaryTitle>{' '}
                <SummaryValue>
                  {' '}
                  {`Rs ${parseFloat(selectedVoucher.billItemsPrice).toFixed(2)}`}{' '}
                </SummaryValue>{' '}
              </SummaryBlock>{' '}
              <SummaryBlock blockType="itemSummary">
                <SummaryTitle> Discount </SummaryTitle>{' '}
                <SummaryValue>
                  {' '}
                  {`Rs ${parseFloat(selectedVoucher.billDiscountAmount).toFixed(2)}`}{' '}
                </SummaryValue>{' '}
              </SummaryBlock>{' '}
              <SummaryBlock blockType="itemSummary">
                <SummaryTitle> Tax </SummaryTitle>{' '}
                <SummaryValue>
                  {' '}
                  {`Rs ${parseFloat(selectedVoucher.billTaxAmount).toFixed(2)}`}{' '}
                </SummaryValue>{' '}
              </SummaryBlock>{' '}
              <SummaryBlock blockType="itemSummary">
                <SummaryTitle> Total Amount </SummaryTitle>{' '}
                <SummaryValue>
                  {' '}
                  {`Rs ${parseFloat(selectedVoucher.billTotalAmountAfterTax).toFixed(2)}`}{' '}
                </SummaryValue>{' '}
              </SummaryBlock>{' '}
              {selectedVoucher.narration !== '' && (
                <SummaryBlock blockType="itemSummary" itemType="narration">
                  <SummaryTitle itemType="narration"> Narration </SummaryTitle>{' '}
                  <SummaryValue itemType="narration"> {selectedVoucher.narration} </SummaryValue>{' '}
                </SummaryBlock>
              )}{' '}
            </DisplayItemsContainer>{' '}
          </FormBlock>{' '}
        </SelectedVoucherBlock>
        {/* record payment popup */} {this.renderRecordPaymentDialog()}
        {/* record payment popup */} {this.renderShareVoucherDialog()}{' '}
      </RightHalfContainer>
    );
  }
}

export default connect(null, {
  getShareVoucherData
})(ViewVoucher);
