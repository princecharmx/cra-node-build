import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import moment from 'moment';

import { Popup } from '../../Popup';
import { Button } from '../../AppStyledComponents';
import { Checked, UnChecked } from '../../../images';
import {
  FormRow,
  FormBlock,
  ItemHeader,
  FormBlockTitle,
  FieldsContainer,
  HorizontalFields
} from '../AddVoucherStyledComponents';
import { TextInputField } from '../../index';
import { Cancel } from '../../../images';

const VoucherItemBlock = styled.div`
  padding: 10px 0px;
  text-overflow: ellipsis;
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontSize ? p.fontSize : '15px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '15px')};
`;
const ItemImg = styled.img`
  background-color: transparent;
  width: ${props => (props.width ? props.width : '15px')};
  height: ${props => (props.height ? props.height : '15px')};
  cursor: ${props => (props.disable === 'true' ? 'not-allowed' : 'pointer')};
`;
export const SelectedVoucherText = styled.div`
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  ${p => p.type === 'empty' && `margin-left: 5px;`};
  ${p => p.type === 'address' && `text-indent: 30px; margin-top: 5px;`};
`;

const PopupTitleContainer = styled.div`
  margin: 0px;
  display: flex;
  line-height: 32px;
  align-items: center;
  padding: 24px 24px 20px;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 0.01rem solid #707070;
  justify-content: space-between;
`;

const ImageHolder = styled.img`
  background-color: transparent;
  width: ${p => (p.width ? p.width : '30px')};
  height: ${p => (p.height ? p.height : '30px')};
  cursor: ${p => (p.cursor ? p.cursor : 'pointer')};
`;

const BottomContianer = styled.div`
  display: flex;
  padding: 0 0 0 10px;
  justify-content: space-between;
`;

const SubContainer = styled.div`
  display:flex;
  width: ${p => (p.width ? p.width : '40%')}
  justify-content: space-between;
`;
const ButtonContainer = styled.div`
  display: block;
  width: 11rem;
  margin-left: auto;
`;

const ShareVoucherDialogTitle = ({ toggleOnHideDrawer, resetSelectedVouchers }) => (
  <PopupTitleContainer>
    <SelectedVoucherText fontSize="18px"> Against Voucher </SelectedVoucherText>{' '}
    <ImageHolder
      src={Cancel}
      height="12px"
      width="12px"
      onClick={() => {
        toggleOnHideDrawer();
        resetSelectedVouchers();
      }}
    />{' '}
  </PopupTitleContainer>
);

const DoneButton = ({ toggleOnHideDrawer }) => (
  <ButtonContainer>
    <Button to="#" margintop="0px" width="100px" height="30px" onClick={() => toggleOnHideDrawer()}>
      Done
    </Button>
  </ButtonContainer>
);

const AgainstVoucherFotter = ({
  totalAmountDue,
  totalAmountPaid,
  toggleOnHideDrawer,
  receviedAmount
}) => {
  return (
    <React.Fragment>
      <BottomContianer>
        <SubContainer width={'40%'}>
          <TextInputField
            labelSize="1%"
            labelText="Recevived Amount"
            value={receviedAmount}
            underline={false}
          />
          {/*<TextInputField
        labelSize="1%"
        textColor={'rgba(218, 73, 73, 1)'}
        value={'10000'}
        labelText="Amount to recorded"
        underline= {false}
      />*/}
        </SubContainer>
        <SubContainer width={'30%'}>
          <TextInputField
            value={totalAmountDue}
            labelSize="1%"
            labelText="Amount Due"
            underline={false}
          />
          <TextInputField
            value={totalAmountPaid}
            labelSize="1%"
            labelText="Pay Amount"
            underline={false}
          />
        </SubContainer>
      </BottomContianer>

      <DoneButton toggleOnHideDrawer={toggleOnHideDrawer} />
    </React.Fragment>
  );
};
const AgainstVoucherDailog = ({
  resetSelectedVouchers,
  onHideDrawer,
  receviedAmount,
  toggleOnHideDrawer,
  selectedBusinessAccount,
  allVouchersSelected,
  handleOnChecked,
  totalAmountPaid,
  unPaidVouchers = [],
  selectedVouchers,
  handlePayAmountChange,
  handleSelectedVoucherClick
}) => {
  const totalAmountDue =
    unPaidVouchers &&
    Boolean(unPaidVouchers.length) &&
    unPaidVouchers.map(voucher => voucher.dueAmount).reduce((a, b) => a + b);
  return (
    <Popup
      modal={false}
      openPopup={onHideDrawer}
      popupWidth="100%"
      popupButtons={
        <AgainstVoucherFotter
          totalAmountDue={totalAmountDue}
          totalAmountPaid={totalAmountPaid}
          toggleOnHideDrawer={toggleOnHideDrawer}
          receviedAmount={receviedAmount}
        />
      }
      label={
        <ShareVoucherDialogTitle
          toggleOnHideDrawer={toggleOnHideDrawer}
          resetSelectedVouchers={resetSelectedVouchers}
        />
      }
    >
      <FormRow type="secondRow">
        <FormBlock width="100%">
          <FormBlockTitle>Unpaid Vouchers</FormBlockTitle>

          <FieldsContainer>
            {/*if type is salse then populate salse col else populate credit col*/}
            <HorizontalFields type="header">
              <ItemHeader width="10%" type="name">
                <ItemImg
                  width="15px"
                  height="15px"
                  src={allVouchersSelected === true ? Checked : UnChecked}
                  onClick={handleOnChecked}
                />
              </ItemHeader>

              <ItemHeader width="15%" type="name">
                Date
              </ItemHeader>

              <ItemHeader width="15%" type="name">
                Voucher No
              </ItemHeader>

              <ItemHeader width="15%" type="name">
                Credit
              </ItemHeader>

              <ItemHeader width="15%" type="name">
                Debit
              </ItemHeader>
              <ItemHeader width="15%" type="name">
                Due Amount
              </ItemHeader>
              <ItemHeader width="15%" type="name">
                Pay Amount
              </ItemHeader>
            </HorizontalFields>

            {_.map(unPaidVouchers, (item, index) => {
              return (
                <HorizontalFields type="values" key={index}>
                  <VoucherItemBlock width="10%">
                    <ItemImg
                      width="15px"
                      height="15px"
                      src={
                        _.find(selectedVouchers, item) !== undefined || allVouchersSelected === true
                          ? Checked
                          : UnChecked
                      }
                      onClick={() => handleSelectedVoucherClick(item, index)}
                    />
                  </VoucherItemBlock>

                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    {moment(item.issueDate).format('MM-DD-YYYY')}
                  </VoucherItemBlock>

                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    <div style={{ textOverflow: 'ellipsis', width: '90%', wordWrap: 'break-word' }}>
                      {item.voucherNo}
                    </div>
                  </VoucherItemBlock>

                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    {item.type === 'sales' ? item.billFinalAmount.toFixed(2) : ''}
                  </VoucherItemBlock>

                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    {item.type === 'sales' ? '' : item.billFinalAmount.toFixed(2)}
                  </VoucherItemBlock>
                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    {item.dueAmount ? item.dueAmount.toFixed(2) : item.billFinalAmount}
                  </VoucherItemBlock>
                  <VoucherItemBlock width="15%" color="#868686" fontSize="14px">
                    {selectedVouchers &&
                      selectedVouchers[index] && (
                        <TextInputField
                          type="number"
                          width="150px"
                          hint="Amount Paid"
                          value={selectedVouchers[index].paidAmount}
                          onChange={value => handlePayAmountChange(value, index)}
                        />
                      )}
                  </VoucherItemBlock>
                </HorizontalFields>
              );
            })}
          </FieldsContainer>
        </FormBlock>
      </FormRow>
    </Popup>
  );
};

export default AgainstVoucherDailog;
