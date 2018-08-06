import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';

import { Cancel, GoBack } from '../../../images';
import * as CONSTANTS from '../../../constants';

import {
  Text,
  Loader,
  NoteRow,
  BackLink,
  SingleRow,
  FormBlock,
  StyledSpan,
  Navigation,
  DisplayNote,
  DisplayItem,
  SummaryTitle,
  NotesOptions,
  SummaryValue,
  ItemTextInput,
  FormBlockTitle,
  NotesContainer,
  NotesInputFields,
  SelectedVoucherRow,
  SelectedVoucherText,
  SelectedVoucherBlock,
  DisplayItemsContainer,
  DisplayHorizontalField
} from '../../../components';

import { Fields, SummaryBlock } from '../../../components/Voucher/AddVoucherStyledComponents';

const ItemBlock = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 30px);
  justify-content: space-between;
  ${p => p.view === 'horizontal' && `flex-direction: row;`} ${p =>
      p.view === 'vertical' && `flex-direction: column;`};
`;

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

class ViewJournal extends Component {
  state = {
    viewMore: true,
    showNotes: false,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    companyId: cookie.load(CONSTANTS.COMPANY_ID),
    notesPayload: {
      note: '',
      byName: cookie.load('userName')
    },
    voucherData: null,
    journalList: []
  };

  componentDidMount() {
    // get the voucher data from the API
    this.getVoucherData();
  }

  getVoucherData() {
    const { match } = this.props;
    const { companyId, userId } = this.state;

    const GET_VOUCHER_DATA_URL = `${CONSTANTS.API_URL}/i-companies/${companyId}/vouchers/${
      match.params.itemId
    }`;

    const accessToken = cookie.load(`${userId}@${companyId}`);

    if (accessToken) {
      axios
        .get(GET_VOUCHER_DATA_URL)
        .then(response => response.data)
        .then(data => {
          this.setState({
            voucherData: data
          });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    const { voucherData } = this.state;
    if (!this.state.voucherData) {
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
              {`${voucherData.type} #${voucherData.voucherNo}`}
            </SelectedVoucherText>
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
                {voucherData.internalNotes.length > 0
                  ? `Internal Notes ${voucherData.internalNotes.length} found`
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

                {voucherData.internalNotes.length > 0 &&
                  _.map(voucherData.internalNotes.reverse(), (internalNote, index) => (
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
          </SelectedVoucherRow>
        </SelectedVoucherBlock>

        <SelectedVoucherBlock type="unset" padding="b">
          <FormBlock width="100%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Journal
            </FormBlockTitle>

            <DisplayItemsContainer>
              <DisplayHorizontalField>
                <DisplayItem
                  width="20%"
                  type="name"
                  color="#4A4A4A"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                >
                  Account
                </DisplayItem>
                <DisplayItem
                  width="50%"
                  type="name"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Description
                </DisplayItem>
                <DisplayItem
                  width="15%"
                  type="name"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Debit
                </DisplayItem>
                <DisplayItem
                  width="15%"
                  type="name"
                  fontSize="14px"
                  fontWeight="400"
                  blockType="header"
                  color="#4A4A4A"
                >
                  Credit
                </DisplayItem>
              </DisplayHorizontalField>

              {voucherData.accountList.length > 0 &&
                _.map(
                  this.state.viewMore === true
                    ? voucherData.accountList.slice(0, 3)
                    : voucherData.accountList,
                  (item, key) => (
                    <DisplayHorizontalField key={key} blockType="content">
                      <DisplayItem
                        width="20%"
                        type="name"
                        fontSize="14px"
                        fontWeight="400"
                        color="#000000"
                      >
                        {item.accountGroupName}
                      </DisplayItem>
                      <DisplayItem
                        color="#000000"
                        type="description"
                        width="50%"
                        fontSize="14px"
                        fontWeight="400"
                      >
                        <DisplayItem
                          color="#000000"
                          type="description"
                          width="95%"
                          fontSize="14px"
                          fontWeight="400"
                        >
                          {item.description}
                        </DisplayItem>
                      </DisplayItem>
                      <DisplayItem
                        width="15%"
                        fontSize="14px"
                        fontWeight="400"
                        type="name"
                        color={
                          item.debitAmount === '0.00' ||
                          item.debitAmount === '0' ||
                          item.debitAmount === '0.0'
                            ? '#bbbbbb'
                            : '#000000'
                        }
                      >
                        {`Rs ${item.debitAmount}`}
                      </DisplayItem>
                      <DisplayItem
                        width="15%"
                        fontSize="14px"
                        fontWeight="400"
                        type="name"
                        color={
                          item.creditAmount === '0.00' ||
                          item.creditAmount === '0' ||
                          item.creditAmount === '0.0'
                            ? '#bbbbbb'
                            : '#000000'
                        }
                      >
                        {`Rs ${item.creditAmount}`}
                      </DisplayItem>
                    </DisplayHorizontalField>
                  )
                )}

              {voucherData.accountList.length > 3 && (
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
            <FormBlockTitle fontSize="15px" color="#4A4A4A" fontWeight="400">
              For internal use
            </FormBlockTitle>
            <Fields>
              <ItemBlock view="vertical">
                <SummaryBlock marginBottom="0px" paddingTop="30px">
                  <SummaryTitle>Prepared By</SummaryTitle>
                  {_.map(this.state.voucherData.preparedBy, item => (
                    <SummaryValue key={item.refId}> {item.name} </SummaryValue>
                  ))}
                </SummaryBlock>

                <SummaryBlock marginBottom="0px" paddingTop="15px">
                  <SummaryTitle>Verified By</SummaryTitle>
                  <ItemTextInput
                    hint="Name"
                    field="name"
                    value={this.state.voucherData.verifiedBy}
                    onChange={value => {
                      this.setState({
                        voucherData: {
                          ...this.state.voucherData,
                          verifiedBy: value
                        }
                      });
                    }}
                  />
                </SummaryBlock>
              </ItemBlock>
            </Fields>
          </FormBlock>

          <FormBlock width="50%">
            <FormBlockTitle fontSize="16px" color="#4A4A4A" fontWeight="400">
              Narration
            </FormBlockTitle>
            <DisplayItemsContainer>
              {voucherData.narration !== '' && (
                <SummaryBlock blockType="itemSummary" itemType="narration">
                  <SummaryValue itemType="narration"> {voucherData.narration} </SummaryValue>
                </SummaryBlock>
              )}
            </DisplayItemsContainer>
          </FormBlock>
        </SelectedVoucherBlock>
      </Container>
    );
  }
}

export default ViewJournal;
