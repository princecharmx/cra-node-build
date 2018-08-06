
import map from 'lodash/map';
import styled from 'styled-components';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import mixpanel from 'mixpanel-browser';
import ClevertapReact from 'clevertap-react';
import { CLEVERTAP_ID, MIXPANEL_ID } from './constants';
import { getShareVoucher } from '../actions/vouchers';
import { increamentVoucherView } from '../actions/vouchers';
import { generateVoucherPdf } from '../actions/vouchers';

import {
  Loader,
  SingleRow,
  FormBlock,
  StyledSpan,
  TextButton,
  ActionBlock,
  DisplayItem,
  SummaryBlock,
  SummaryTitle,
  SummaryValue,
  FormBlockTitle,
  SelectedVoucherRow,
  SelectedVoucherText,
  SelectedVoucherBlock,
  DisplayItemsContainer,
  SelectedVoucherActions,
  DisplayHorizontalField
} from '../components';

import {
  Fields,
  ItemHeader,
  FieldsContainer,
  HorizontalBlock,
  HorizontalFields
} from '../components/Voucher/AddVoucherStyledComponents';

const Container = styled.div`
  height: 100vh;
  display: flex;
  background: #f4f5f7;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 70vw;
  padding: 30px 0px;
  background: white;
  box-shadow: 0px 0px 20px -1px rgba(128, 128, 128, 1);
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class ViewVoucher extends Component {
  constructor() {
    super();
    mixpanel.init(MIXPANEL_ID);
    ClevertapReact.initialize(CLEVERTAP_ID);
  }

  state = {
    viewMore: true,
    selectedVoucher: null
  };

  componentDidMount() {
    console.log("works");
    // get the voucher data from the API
    this.getVoucherData();
    this.voucherStatusIncrementCount(); // TODO this is temp fix
  }

  getVoucherData() {
    const { match: { params: { shareId } }, getShareVoucher } = this.props;
    getShareVoucher(shareId);
  }

  voucherStatusIncrementCount() {
    if (!this.props.selectedVoucher || !this.props.selectedVoucher.voucher) {
      return;
    }
    const {
      match: { params: { shareId } },
      selectedVoucher: { voucher: { id } },
      increamentVoucherView
    } = this.props;
    if (id != null && shareId != null) {
      increamentVoucherView(id, shareId);
    }
  }

  handleDownloadClick() {
    const { selectedVoucher: { voucher: { id } }, generateVoucherPdf } = this.props;

    generateVoucherPdf(id);
  }

  render() {
    if (!this.props.selectedVoucher.voucher) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }

    const { selectedVoucher: { voucher: selectedVoucher } } = this.props;
    return (
      <Container>
        <Content>
          <SelectedVoucherBlock type="unset" padding="lbr">
            <SelectedVoucherRow>
              <SelectedVoucherText fontSize="18px">
                {`${selectedVoucher.type} #${selectedVoucher.voucherNo}`}
              </SelectedVoucherText>

              <SelectedVoucherActions>
                <ActionBlock>
                  <TextButton
                    label="Download"
                    color="#428BCA"
                    onClick={() => this.handleDownloadClick()}
                  />
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
          </SelectedVoucherBlock>

          <SelectedVoucherBlock type="secondRow" padding="b">
            <FormBlock width="50%">
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

            <FormBlock width="50%">
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
                  map(
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
                        <DisplayItem width="12.5%" fontSize="14px" fontWeight="400" color="#000000">
                          {item.hsn}
                        </DisplayItem>
                        <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                          {`${item.taxPercentage} %`}
                        </DisplayItem>
                        <DisplayItem width="9%" fontSize="14px" fontWeight="400" color="#000000">
                          {item.qty}
                        </DisplayItem>
                        <DisplayItem width="12.5%" fontSize="14px" fontWeight="400" color="#000000">
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
            <FormBlock width="50%">
              <FormBlockTitle>Tax Breakup</FormBlockTitle>

              <FieldsContainer>
                <HorizontalFields type="header">
                  <ItemHeader width="25%">Tax</ItemHeader>
                  <ItemHeader width="25%">IGST</ItemHeader>
                  <ItemHeader width="25%">SGST</ItemHeader>
                  <ItemHeader width="25%">CGST</ItemHeader>
                </HorizontalFields>

                {map(selectedVoucher.tax, (tax, key) => (
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

            <FormBlock width="50%">
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
        </Content>
      </Container>
    );
  }
}

// export default ViewVoucher;
const mapStateToProps = ({ selectedVoucher }) => ({
  selectedVoucher
});

export default connect(mapStateToProps, {
  getShareVoucher,
  generateVoucherPdf,
  increamentVoucherView
})(ViewVoucher);
