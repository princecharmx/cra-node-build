import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';
import { CardText } from 'material-ui/Card';
import { MenuItem, Popover, Menu, Chip, FlatButton } from 'material-ui/';

import {
  Text,
  Popup,
  NoteRow,
  BackLink,
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
  ShareListHeader,
  NotesInputFields,
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
  ShareContactSuggestions
} from '../../../../components';
import * as CONSTANTS from '../../../../constants';
import { GoBack, Share, Cancel, Checked, UnChecked } from '../../../../images';

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

const ImageHolder = styled.img`
  cursor: pointer;
  background: transparent;
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 15px 0px 0px 0px;
`;

const PaddingBlock = styled.div`
  padding-top: 30px;
`;

const Amount = styled.div`
  width: 83px;
  color: #3d3d3d;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 5px;
  font-family: 'Dax Regular';
  border-bottom: 1px solid #868686;
`;

const EmailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PhoneRegEx = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export class ReceiptAndPayment extends Component {
  state = {
    tempVerifiedName: {
      0: {
        name: ''
      }
    },
    shareVoucherPayload: {
      shareData: []
    },
    tempVerifiedNameIndex: 0,
    showNotes: false,
    notesPayload: '',
    openShareVoucherDialog: false,
    openActions: false,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    companyId: cookie.load(CONSTANTS.COMPANY_ID)
  };

  renderShareVoucherDialog() {
    const { openShareVoucherDialog } = this.state;
    const { shareVoucherContactsData } = this.props;

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
                  hint="Add a contact"
                  containerHeight="30px"
                  containerWidth="115px"
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

  handleShareVoucherSubmitClick() {
    const { shareVoucherPayload, companyId, userId } = this.state;
    const { selectedVoucher, company: { primaryBranchId } } = this.props;

    const companyAccessToken = cookie.load(`${userId}@${companyId}`);

    const payload = {
      voucherIds: [selectedVoucher.id],
      shareData: shareVoucherPayload.shareData
    };

    const POST_SHARE_VOUCHER_URL = `${
      CONSTANTS.API_URL
    }/i-companies/${companyId}/i-branches/${primaryBranchId}/vouchers/share`;

    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';

      if (shareVoucherPayload.shareData.length > 0) {
        axios
          .post(POST_SHARE_VOUCHER_URL, payload)
          .then(response => response.data)
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
          });
      }
    }
  }

  render() {
    const { selectedVoucher } = this.props;
    return (
      <Container>
        <Navigation>
          <BackLink onClick={() => this.props.history.goBack()}>
            <ImageHolder src={GoBack} height="16px" width="16px" />
            <Text color="#868686" paddingLeft="10px">
              {' '}
              Back{' '}
            </Text>
          </BackLink>
        </Navigation>

        <SelectedVoucherBlock type="unset" padding="lbr">
          <SelectedVoucherRow>
            <SelectedVoucherText fontSize="18px">
              {`${selectedVoucher.type} #${selectedVoucher.voucherNo}`}
            </SelectedVoucherText>

            <SelectedVoucherActions>
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
                    <MenuItem primaryText="Download" />
                    <MenuItem primaryText="Print" />
                    <MenuItem
                      primaryText="Delete"
                      onClick={() => console.log('delete voucher clicked')}
                    />
                  </Menu>
                </Popover>
              </ActionBlock>
            </SelectedVoucherActions>
          </SelectedVoucherRow>

          <SelectedVoucherRow type="container" margin="top">
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
                {selectedVoucher.internalNotes && selectedVoucher.internalNotes.length > 0
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
                    value={this.state.notesPayload.note}
                    onChange={value => {
                      this.setState({
                        notesPayload: {
                          ...this.state.notesPayload,
                          note: value
                        }
                      });
                    }}
                  />
                  <NotesOptions>
                    <SelectedVoucherText
                      color="#428BCA"
                      fontSize="14px"
                      cursor="pointer"
                      onClick={() => {
                        this.setState({
                          notesPayload: {
                            ...this.state.notesPayload,
                            note: ''
                          }
                        });
                      }}
                    >
                      Add
                    </SelectedVoucherText>
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
                    />
                  </NotesOptions>
                </NotesInputFields>
                {selectedVoucher.internalNotes.length > 0 &&
                  _.map(selectedVoucher.internalNotes.reverse(), (internalNote, index) => (
                    <DisplayNote>
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

            <SelectedVoucherText fontSize="15px">
              {`Total amount paid Rs${selectedVoucher.billFinalAmount}`}
            </SelectedVoucherText>
          </SelectedVoucherRow>
        </SelectedVoucherBlock>

        <SelectedVoucherBlock type="secondRow" padding="b">
          <FormBlock width="100%">
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
                {`Pincode: ${selectedVoucher.party.pincode},`}{' '}
              </SelectedVoucherText>
              <SelectedVoucherText fontSize="14px" type="address">
                {' '}
                {`GSTIN: ${selectedVoucher.party.gstin}.`}{' '}
              </SelectedVoucherText>
            </DisplayItemsContainer>
          </FormBlock>
        </SelectedVoucherBlock>

        <SelectedVoucherBlock type="thirdRow" padding="b">
          <FormBlock width="100%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Payments Against
            </FormBlockTitle>

            <DisplayItemsContainer>
              <DisplayHorizontalField>
                <DisplayItem
                  width="19.9%"
                  type="Date"
                  color="#4A4A4A"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                >
                  Date
                </DisplayItem>
                <DisplayItem
                  width="19.9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Voucher No
                </DisplayItem>
                <DisplayItem
                  width="19.9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Total
                </DisplayItem>
                <DisplayItem
                  width="19.9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Amount Paid
                </DisplayItem>
                <DisplayItem
                  width="19.9%"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Payment
                </DisplayItem>
              </DisplayHorizontalField>

              {selectedVoucher && (
                <DisplayHorizontalField blockType="content">
                  <DisplayItem width="19.9%" fontSize="14px" fontWeight="400" color="#000000">
                    {moment(selectedVoucher.issueDate).format('DD/MM/YYYY')}
                  </DisplayItem>
                  <DisplayItem width="19.9%" fontSize="14px" fontWeight="400" color="#000000">
                    {selectedVoucher.voucherNo}
                  </DisplayItem>
                  <DisplayItem width="19.9%" fontSize="14px" fontWeight="400" color="#000000">
                    {selectedVoucher.billFinalAmount}
                  </DisplayItem>
                  <DisplayItem width="19.9%" fontSize="14px" fontWeight="400" color="#000000">
                    {`${parseFloat(selectedVoucher.paidAmount)}`}
                  </DisplayItem>
                  <DisplayItem width="19.9%" fontSize="14px" fontWeight="400" color="#000000">
                    {selectedVoucher.paymentMethod}
                  </DisplayItem>
                </DisplayHorizontalField>
              )}

              {selectedVoucher.length > 3 && (
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
          <FormBlock width="50%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400" />
            <DisplayItemsContainer>
              <SummaryBlock blockType="itemSummary" itemType="narration">
                <SummaryTitle itemType="narration">Narration</SummaryTitle>
                <SummaryValue itemType="narration"> {selectedVoucher.narration} </SummaryValue>
                <PaddingBlock>
                  {_.map(selectedVoucher.preparedBy, (item, key) => (
                    <SummaryBlock key={key}>
                      <SummaryTitle>Prepared By:</SummaryTitle>
                      <SummaryValue> {item.name} </SummaryValue>
                    </SummaryBlock>
                  ))}

                  <SummaryBlock>
                    <SummaryTitle>Verified By</SummaryTitle>
                    <ItemTextInput
                      hint="Name"
                      field="name"
                      value={this.state.verifiedBy}
                      onChange={value => {
                        this.setState({
                          addPayload: {
                            ...this.state.addPayload,
                            verifiedBy: value
                          }
                        });
                      }}
                    />
                  </SummaryBlock>
                </PaddingBlock>
              </SummaryBlock>
            </DisplayItemsContainer>
          </FormBlock>

          <FormBlock width="50%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Summary
            </FormBlockTitle>
            <DisplayItemsContainer>
              <SummaryBlock itemType="narration" marginLeft>
                <Amount>Total Amount</Amount>
                <SummaryValue itemType="narration">
                  {' '}
                  {`Rs ${parseFloat(selectedVoucher.billFinalAmount).toFixed(2)}`}{' '}
                </SummaryValue>
              </SummaryBlock>
            </DisplayItemsContainer>
          </FormBlock>
        </SelectedVoucherBlock>
        {this.renderShareVoucherDialog()}
      </Container>
    );
  }
}

export default ReceiptAndPayment;
