import _ from 'lodash';
import moment from 'moment';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { CardHeader, CardText, CardActions } from 'material-ui/Card';
import { MenuItem, Popover, FlatButton, Menu, Chip } from 'material-ui/';
import SPCDHelper from './common/SPCDHelper';
import { formatDate, errorObj } from '../../../utils';
import {
  updateVoucherTypes,
  getVoucherData,
  getShareVoucherData,
  handleNoteAddClick,
  handleRecordPaymentSubmitClick,
  handleAccessToggleClick,
  togglePurchaseSalesCreationDrawer,
  handleShareVoucherSubmitClick,
  handleDeleteVoucherClick,
  setCreditDebitDetailsOnCreationDrawer
} from '../../../actions';

import { Share, Cancel, GoBack, Checked, UnChecked, PaymentIcon } from '../../../images';
import { getSelectedVoucherDetails } from '../../../reducers';
import * as CONSTANTS from '../../../constants';

import {
  Text,
  Popup,
  Loader,
  NoteRow,
  DateTime,
  BackLink,
  PopupRow,
  Dropdown,
  SingleRow,
  FormBlock,
  StyledSpan,
  TextButton,
  Navigation,
  ActionBlock,
  DisplayNote,
  DisplayItem,
  ContactInfo,
  ContactCard,
  SummaryBlock,
  SummaryTitle,
  NotesOptions,
  SummaryValue,
  InfoContainer,
  ItemTextInput,
  FormBlockTitle,
  NotesContainer,
  TextInputField,
  ShareListHeader,
  NotesInputFields,
  PaymentHistoryRow,
  PaymentHistoryText,
  ShareContactsField,
  SharedListFlexItem,
  PopupTitleContainer,
  SelectedVoucherRow,
  SelectedVoucherText,
  SelectedVoucherBlock,
  DisplayItemsContainer,
  SharedListContactText,
  SharedListContactCard,
  SelectedVoucherActions,
  DisplayHorizontalField,
  ListItemsAndInputField,
  PaymentHistoryContainer,
  ShareContactSuggestions
} from '../../../components';

import {
  Fields,
  ItemHeader,
  FieldsContainer,
  HorizontalBlock,
  HorizontalFields
} from '../../../components/Voucher/AddVoucherStyledComponents';
import AddCreditNoteContianer from '../add/AddCreditNoteContainer';

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
  overflow: scroll;
  padding: 15px 0px 0px 0px;
`;

const ImageHolder = styled.img`
  cursor: pointer;
  background: transparent;
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line
const EmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PhoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;

class ViewCreditNote extends Component {
  state = {
    anchorEl: {},
    viewMore: true,
    issueDateObj: {},
    showNotes: false,
    openActions: false,
    shareInputValue: '',
    expandRecordPayment: false,
    openShareVoucherDialog: false,
    openRecordPaymentDialog: false,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    companyId: cookie.load(CONSTANTS.COMPANY_ID),

    selectedVoucher: null,

    notesPayload: {
      note: '',
      byName: cookie.load('userName')
    },

    recordPaymentPayload: {
      dueAmount: '',
      issueDate: '',
      narration: '',
      paidAmount: '',
      type: CONSTANTS.VOUCHER_TYPE_RECEIPT,
      voucherNo: '',
      refVoucherId: '',
      paymentMethod: '',
      party: {},
      billFinalAmount: '',
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
    // get the voucher data from the API
    this.getVoucherData();
  }

  getVoucherData() {
    const { match: { params: { voucherID: voucherId } } } = this.props;
    this.props.getVoucherData(voucherId);
  }

  getShareVoucherData() {
    const { selectedVoucher: { party: { refId }, id } } = this.props;
    this.props
      .getShareVoucherData(refId, id)
      .then(data => {
        this.setState({
          shareVoucherContactsData: {
            contacts: [...data.contacts],
            shareContacts: [...data.shareContacts]
          }
        });
      })
      .catch(errorObj);
  }

  handleAccessToggleClick(contact, key) {
    const { selectedVoucher: { id: voucherId } } = this.props;
    this.props
      .handleAccessToggleClick(voucherId, contact)
      .then(data => {
        this.setState(
          {
            openShareVoucherDialog: false
          },
          this.getShareVoucherData
        );
      })
      .catch(errorObj);
  }

  handleDeleteVoucherClick() {
    const { selectedVoucher: { id: voucherId } } = this.props;
    this.props
      .handleDeleteVoucherClick(voucherId)
      .then(response => {
        this.props.updateVoucherTypes(!this.props.voucherTypesUpdateState);
        this.props.history.goBack();
      })
      .catch(errorObj);
  }

  handleNoteAddClick() {
    const { match: { params: { voucherID: voucherId } } } = this.props;
    const { notesPayload } = this.state;
    if (notesPayload.note !== '') {
      this.props
        .handleNoteAddClick(voucherId, notesPayload)
        .then(data => {
          this.getVoucherData();
          this.setState({
            notesPayload: {
              ...this.state.notesPayload,
              note: ''
            }
          });
        })
        .catch(errorObj);
    }
  }

  handleNoteCloseClick() {
    this.setState({
      showNotes: !this.state.showNotes,
      notesPayload: {
        ...this.state.notesPayload,
        note: ''
      }
    });
  }

  handleRecordPaymentSubmitClick() {
    const { match: { params: { voucherID: voucherId } } } = this.props;
    const { recordPaymentPayload } = this.state;
    this.props
      .handleRecordPaymentSubmitClick(voucherId, recordPaymentPayload)
      .then(response => {
        this.setState(
          {
            openRecordPaymentDialog: false
          },
          this.getVoucherData
        );
      })
      .catch(errorObj);
  }

  handleShareVoucherSubmitClick() {
    const { shareVoucherPayload: { shareData }, selectedVoucher: { id } } = this.props;
    const payload = {
      voucherIds: [id],
      shareData: shareData
    };
    if (shareData.length > 0) {
      this.props
        .handleShareVoucherSubmitClick(payload)
        .then(data => {
          this.setState(
            {
              openShareVoucherDialog: false,
              shareVoucherPayload: {
                shareData: []
              }
            },
            this.getShareVoucherData
          );
        })
        .catch(errorObj);
    }
  }

  setDefaultValues() {
    const { selectedVoucher } = this.props;

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

  renderRecordPaymentDialog() {
    const { selectedVoucher } = this.props;

    const recordPaymentDialogActions = [];

    const recordPaymentDialogTitle = (
      <PopupTitleContainer>
        <SelectedVoucherText fontSize="18px">Payments</SelectedVoucherText>
        <ImageHolder
          src={Cancel}
          height="12px"
          width="12px"
          onClick={() => this.setState({ openRecordPaymentDialog: false })}
        />
      </PopupTitleContainer>
    );

    return (
      <Popup
        popupWidth="600px"
        label={recordPaymentDialogTitle}
        popupButtons={recordPaymentDialogActions}
        openPopup={this.state.openRecordPaymentDialog}
      >
        {selectedVoucher.dueAmount !== 0 && (
          <PaymentHistoryContainer>
            <CardText expandable={true} style={{ padding: '0px' }}>
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
                />
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
                />
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
                        paidAmount: parseFloat(value) || '',
                        billFinalAmount: parseFloat(value) || ''
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
                </Dropdown>
              </PopupRow>
            </CardText>

            <CardActions expandable={true} style={cardStyles.buttons}>
              <FlatButton
                label="Record"
                primary={true}
                style={{
                  marginRight: '0px !important',
                  margin: '0px 0px 0px 0px !important'
                }}
                onClick={() => this.handleRecordPaymentSubmitClick()}
              />
            </CardActions>
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
                style={{ padding: '0px 0px 10px 0px', cursor: 'default' }}
              />

              {_.map(selectedVoucher.paymentHistory.reverse(), item => (
                <CardText
                  expandable={false}
                  style={{ padding: '10px 0px' }}
                  key={item.paymentVoucherId}
                >
                  <PaymentHistoryRow>
                    <PaymentHistoryText fontSize="14px" color="#868686" width="126px">
                      {moment(item.timestamp).format('DD-MM-YYYY')}
                    </PaymentHistoryText>
                    <PaymentHistoryText fontSize="14px" color="#868686" width="150px">
                      {item.paymentVoucherNo || 'payment voucher no'}
                    </PaymentHistoryText>
                    <PaymentHistoryText fontSize="14px" color="#868686">
                      {item.paymentMethod || 'payment method'}
                    </PaymentHistoryText>
                    <PaymentHistoryText fontSize="14px" color="#868686">
                      {`Rs ${item.paidAmount}` || 'paid amount'}
                    </PaymentHistoryText>
                  </PaymentHistoryRow>
                </CardText>
              ))}
            </PaymentHistoryContainer>
          )}
      </Popup>
    );
  }

  renderShareVoucherDialog() {
    const { shareVoucherContactsData, openShareVoucherDialog } = this.state;

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
        openPopup={openShareVoucherDialog}
      >
        {shareVoucherContactsData.contacts.length > 0 && (
          <CardText style={cardStyles.row}>
            <ShareContactSuggestions>
              {_.map(shareVoucherContactsData.contacts, contact => (
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
              onClick={() => this.handleShareVoucherSubmitClick()}
            />
          </ShareContactsField>
        </CardText>

        {shareVoucherContactsData.shareContacts.length > 0 && (
          <CardText style={cardStyles.row}>
            <ShareListHeader> Shared List </ShareListHeader>

            {_.map(shareVoucherContactsData.shareContacts, (contact, key) => (
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

  handleEditVoucherClick = () => {
    const { selectedVoucher, match: { params: { voucherID } } } = this.props;
    // populates voucher data on addVoucher Drawer
    this.props.setCreditDebitDetailsOnCreationDrawer(selectedVoucher, voucherID);
    //open addDrawer
    this.props.togglePurchaseSalesCreationDrawer();
  };

  render() {
    if (Object.keys(this.props.selectedVoucher).length === 0) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }

    const { selectedVoucher } = this.props;
    return (
      <SPCDHelper>
        {({
          handleNoteAddClick,
          state,
          onChangeHandler,
          toggleShowNotes,
          handleNoteCloseClick
        }) => (
          <Container>
            <Navigation>
              <BackLink onClick={() => this.props.history.goBack()}>
                <ImageHolder src={GoBack} height="16px" width="16px" />
                <Text color="#868686" paddingLeft="10px" cursor="pointer">
                  {' '}
                  Back{' '}
                </Text>
              </BackLink>
            </Navigation>

            <SelectedVoucherBlock type="firstRow" padding="lbr">
              <SelectedVoucherRow>
                <SelectedVoucherText fontSize="18px">
                  {`${selectedVoucher.type} #${selectedVoucher.voucherNo}`}
                </SelectedVoucherText>

                <SelectedVoucherActions>
                  <ActionBlock
                    margin="right"
                    onClick={() => this.setState({ openRecordPaymentDialog: true })}
                  >
                    <ImageHolder src={PaymentIcon} width="22px" height="15px" />
                    <SelectedVoucherText color="#428BCA" type="empty">
                      Payments
                    </SelectedVoucherText>
                  </ActionBlock>

                  <ActionBlock
                    margin="right"
                    onClick={() => this.setState({ openShareVoucherDialog: true })}
                  >
                    <ImageHolder src={Share} width="22px" height="15px" />
                    <SelectedVoucherText color="#428BCA" type="empty">
                      Share
                    </SelectedVoucherText>
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
                    />
                    <Popover
                      open={this.state.openActions}
                      anchorEl={this.state.anchorEl}
                      targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      onRequestClose={() => this.setState({ openActions: !this.state.openActions })}
                    >
                      <Menu>
                        <MenuItem
                          primaryText="Delete"
                          onClick={() => this.handleDeleteVoucherClick()}
                        />
                        <MenuItem primaryText="Edit" onClick={this.handleEditVoucherClick} />
                      </Menu>
                    </Popover>
                  </ActionBlock>
                </SelectedVoucherActions>
              </SelectedVoucherRow>

              <SelectedVoucherRow margin="top">
                <SelectedVoucherText fontSize="15px">
                  {' '}
                  {`Total Amount: Rs ${selectedVoucher.billFinalAmount}`}{' '}
                </SelectedVoucherText>

                <SelectedVoucherText fontSize="15px">
                  {' '}
                  {`Balance Due: Rs ${selectedVoucher.dueAmount}`}{' '}
                </SelectedVoucherText>
              </SelectedVoucherRow>

              <SelectedVoucherRow type="container" margin="top">
                {!state.showNotes ? (
                  <SelectedVoucherText
                    cursor="pointer"
                    color="#428BCA"
                    fontSize="15px"
                    onClick={toggleShowNotes}
                  >
                    {selectedVoucher.internalNotes.length > 0
                      ? `Internal Notes ${selectedVoucher.internalNotes.length} found`
                      : 'Add Internal Notes'}
                  </SelectedVoucherText>
                ) : (
                  <NotesContainer>
                    <NotesInputFields>
                      <ItemTextInput
                        field="name"
                        page="showNote"
                        id="internalNote"
                        hint="Add a comment"
                        containerHeight="20px"
                        containerWidth="225px"
                        value={state.notesPayload.note}
                        onChange={onChangeHandler}
                      />

                      <NotesOptions>
                        <SelectedVoucherText
                          color="#428BCA"
                          fontSize="14px"
                          cursor="pointer"
                          onClick={() => handleNoteAddClick(this.props.match.params.voucherID)}
                        >
                          Add
                        </SelectedVoucherText>

                        <ImageHolder
                          src={Cancel}
                          width="10px"
                          height="10px"
                          type="leftPadding"
                          onClick={() => handleNoteCloseClick()}
                        />
                      </NotesOptions>
                    </NotesInputFields>

                    {selectedVoucher.internalNotes.length > 0 &&
                      _.map(selectedVoucher.internalNotes, (internalNote, index) => (
                        <DisplayNote key={index}>
                          <NoteRow>
                            <SelectedVoucherText fontSize="11px" color="#000000">
                              {internalNote.byName}
                            </SelectedVoucherText>
                            <SelectedVoucherText fontSize="10px" color="rgba(0, 0, 0, 0.3)">
                              {moment(internalNote.timestamp).format('MMM Do, h:m A')}
                            </SelectedVoucherText>
                          </NoteRow>

                          <SelectedVoucherText fontSize="11px" color="rgba(0, 0, 0, 0.3)">
                            {internalNote.note}
                          </SelectedVoucherText>
                        </DisplayNote>
                      ))}
                  </NotesContainer>
                )}
              </SelectedVoucherRow>
            </SelectedVoucherBlock>

            <SelectedVoucherBlock type="secondRow" padding="b">
              <FormBlock width="60%">
                <FormBlockTitle fontSize="15px" color="#4A4A4A" fontWeight="400">
                  Party Name
                </FormBlockTitle>
                <DisplayItemsContainer>
                  <SelectedVoucherText fontSize="14px" color="#000000" type="address">
                    {' '}
                    {`${selectedVoucher.party.name},`}{' '}
                  </SelectedVoucherText>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`${selectedVoucher.party.address},`}{' '}
                  </SelectedVoucherText>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`${selectedVoucher.party.city}, India,`}{' '}
                  </SelectedVoucherText>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`GSTIN: ${selectedVoucher.party.gstin}`}{' '}
                  </SelectedVoucherText>
                </DisplayItemsContainer>
              </FormBlock>

              <FormBlock width="40%">
                <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
                  Ship To Address
                </FormBlockTitle>
                <DisplayItemsContainer>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`${selectedVoucher.shippingAddress.address},`}{' '}
                  </SelectedVoucherText>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`${selectedVoucher.shippingAddress.city}, ${
                      selectedVoucher.shippingAddress.country
                    },`}{' '}
                  </SelectedVoucherText>
                  <SelectedVoucherText fontSize="14px" type="address">
                    {' '}
                    {`Pincode: ${selectedVoucher.shippingAddress.pincode}`}{' '}
                  </SelectedVoucherText>
                </DisplayItemsContainer>
              </FormBlock>
            </SelectedVoucherBlock>

            <SelectedVoucherBlock type="thirdRow" padding="b">
              <FormBlock width="100%">
                <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
                  Items
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
                      Name
                    </DisplayItem>
                    <DisplayItem
                      width="12.5%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      HSN
                    </DisplayItem>
                    <DisplayItem
                      width="9%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Tax (%)
                    </DisplayItem>
                    <DisplayItem
                      width="9%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Qty
                    </DisplayItem>
                    <DisplayItem
                      width="12.5%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Price/Unit
                    </DisplayItem>
                    <DisplayItem
                      width="9%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Units
                    </DisplayItem>
                    <DisplayItem
                      width="11%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Discount
                    </DisplayItem>
                    <DisplayItem
                      width="14%"
                      fontSize="14px"
                      fontWeight="400"
                      blockType="header"
                      color="#4A4A4A"
                    >
                      Amount
                    </DisplayItem>
                  </DisplayHorizontalField>

                  {selectedVoucher.itemList.length > 0 &&
                    _.map(
                      this.state.viewMore === true
                        ? selectedVoucher.itemList.slice(0, 3)
                        : selectedVoucher.itemList,
                      (item, key) => (
                        <DisplayHorizontalField key={key} blockType="content">
                          <DisplayItem
                            width="23%"
                            type="name"
                            fontSize="14px"
                            fontWeight="400"
                            color="#000000"
                          >
                            {item.itemName}
                          </DisplayItem>
                          <DisplayItem
                            width="12.5%"
                            fontSize="14px"
                            fontWeight="400"
                            color="#000000"
                          >
                            {item.hsn}
                          </DisplayItem>
                          <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                            {`${item.taxPercentage} %`}
                          </DisplayItem>
                          <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                            {item.qty}
                          </DisplayItem>
                          <DisplayItem
                            width="12.5%"
                            fontSize="14px"
                            fontWeight="400"
                            color="#000000"
                          >
                            {item.unitSellPrice}
                          </DisplayItem>
                          <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                            {item.unit}
                          </DisplayItem>
                          <DisplayItem width="11%" fontSize="14px" fontWeight="400" color="#000000">
                            {`${parseFloat(item.discountValue)} ${item.discountUnit}`}
                          </DisplayItem>
                          <DisplayItem width="14%" fontSize="14px" fontWeight="400" color="#000000">
                            {`${parseFloat(item.lineAmount).toFixed(2)}`}
                          </DisplayItem>
                        </DisplayHorizontalField>
                      )
                    )}

                  {selectedVoucher.itemList.length > 3 && (
                    <SingleRow type="viewMore">
                      <StyledSpan onClick={() => this.setState({ viewMore: !this.state.viewMore })}>
                        {this.state.viewMore === true ? 'View More' : 'View Less'}
                      </StyledSpan>
                    </SingleRow>
                  )}
                </DisplayItemsContainer>
              </FormBlock>
            </SelectedVoucherBlock>

            <SelectedVoucherBlock type="fourthRow">
              <FormBlock width="60%">
                <FormBlockTitle>Tax Breakup</FormBlockTitle>

                <FieldsContainer>
                  <HorizontalFields type="header">
                    <ItemHeader width="25%">Tax</ItemHeader>
                    <ItemHeader width="25%">IGST</ItemHeader>
                    <ItemHeader width="25%">SGST</ItemHeader>
                    <ItemHeader width="25%">CGST</ItemHeader>
                  </HorizontalFields>

                  {_.map(selectedVoucher.tax, (tax, key) => (
                    <HorizontalFields key={key}>
                      <ItemHeader width="25%" fontWeight="400" color="#000000">
                        {`${tax.taxPercentage}% (${tax.tax})`}
                      </ItemHeader>

                      <ItemHeader width="25%" fontWeight="400" color="#000000">
                        {tax.igst}
                      </ItemHeader>

                      <ItemHeader width="25%" fontWeight="400" color="#000000">
                        {`${tax.taxPercentage / 2}% (${tax.sgst})`}
                      </ItemHeader>

                      <ItemHeader width="25%" fontWeight="400" color="#000000">
                        {`${tax.taxPercentage / 2}% (${tax.cgst})`}
                      </ItemHeader>
                    </HorizontalFields>
                  ))}

                  <HorizontalFields>
                    <ItemHeader width="25%" fontWeight="400" color="#000000">
                      {`Rs ${selectedVoucher.billTaxAmount}`}
                    </ItemHeader>

                    <ItemHeader width="25%" fontWeight="400" color="#000000">
                      Rs 0
                    </ItemHeader>

                    <ItemHeader width="25%" fontWeight="400" color="#000000">
                      {`Rs ${selectedVoucher.billTaxAmount / 2}`}
                    </ItemHeader>

                    <ItemHeader width="25%" fontWeight="400" color="#000000">
                      {`Rs ${selectedVoucher.billTaxAmount / 2}`}
                    </ItemHeader>
                  </HorizontalFields>
                </FieldsContainer>
              </FormBlock>

              <FormBlock width="40%">
                <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
                  Summary
                </FormBlockTitle>
                <Fields type="summary">
                  <HorizontalBlock type="summary">
                    <SummaryBlock>
                      <SummaryTitle>Total Price</SummaryTitle>
                      <SummaryValue> {`Rs ${selectedVoucher.billItemsPrice}`} </SummaryValue>
                    </SummaryBlock>
                    <SummaryBlock>
                      <SummaryTitle>Discount</SummaryTitle>
                      <SummaryValue> {`Rs ${selectedVoucher.billDiscountAmount}`} </SummaryValue>
                    </SummaryBlock>
                    <SummaryBlock>
                      <SummaryTitle>Tax</SummaryTitle>
                      <SummaryValue> {`Rs ${selectedVoucher.billTaxAmount}`} </SummaryValue>
                    </SummaryBlock>
                    <SummaryBlock>
                      <SummaryTitle>Total Amount</SummaryTitle>
                      <SummaryValue> {`Rs ${selectedVoucher.billFinalAmount}`} </SummaryValue>
                    </SummaryBlock>
                    <SummaryBlock>
                      <SummaryTitle>Balance Due</SummaryTitle>
                      <SummaryValue> {`Rs ${selectedVoucher.dueAmount}`} </SummaryValue>
                    </SummaryBlock>
                  </HorizontalBlock>
                </Fields>
              </FormBlock>
            </SelectedVoucherBlock>

            {/* record payment popup */}
            {this.renderRecordPaymentDialog()}

            {/* record payment popup */}
            {this.renderShareVoucherDialog()}
            <AddCreditNoteContianer mode={CONSTANTS.EDIT} />
          </Container>
        )}
      </SPCDHelper>
    );
  }
}

const mapStateToProps = state => {
  const { voucherTypesUpdateState } = state;

  return {
    selectedVoucher: getSelectedVoucherDetails(state),
    voucherTypesUpdateState
  };
};

export default connect(mapStateToProps, {
  updateVoucherTypes,
  getVoucherData,
  getShareVoucherData,
  handleNoteAddClick,
  handleDeleteVoucherClick,
  togglePurchaseSalesCreationDrawer,
  handleRecordPaymentSubmitClick,
  handleAccessToggleClick,
  handleShareVoucherSubmitClick,
  setCreditDebitDetailsOnCreationDrawer
})(ViewCreditNote);
