import React from 'react';
import { Card, CardText } from 'material-ui';

import { Cancel, AvatarIcon } from '../../../images/index';
import { Title, Header, Avatar, CancelIcon, cardStyles, HeaderTitle } from '../addSPCDStyles/index';
import {
  Fields,
  FormRow,
  FormBlock,
  FormBlockTitle,
  HorizontalBlock
} from '../AddVoucherStyledComponents';
import { DateTime, TextInputField } from '../../InputFields';
import PartySearch from './PartySearch';

const AccountDetailsFields = ({
  payload,
  searchText,
  updateDate,
  issueDateObj,
  currentBalance,
  updateVoucherNo,
  updateAccountType,
  validateVoucherNo,
  updateBusinessContact,
  addVoucherValidations,
  selectedBusinessAccount,
  closeBusinessContactCard,
  businessAccountsSuggestions
}) => (
  <FormRow type="firstRow">
    <FormBlock width="50%">
      <FormBlockTitle>Party Name</FormBlockTitle>
      <Fields>
        <PartySearch {...this.props} />
        <HorizontalBlock type="summary">
          {selectedBusinessAccount && (
            <Card style={cardStyles.card}>
              <Header>
                <HeaderTitle>
                  <Avatar src={AvatarIcon} />
                  <Title>{`${selectedBusinessAccount.aliasName}`} </Title>
                </HeaderTitle>
                <CancelIcon src={Cancel} onClick={closeBusinessContactCard} />
              </Header>

              <CardText>
                {selectedBusinessAccount.address}, <br />
                {selectedBusinessAccount.city}, {selectedBusinessAccount.pincode},
                {selectedBusinessAccount.gstin && `GSTIN: ${selectedBusinessAccount.gstin}`}
                {selectedBusinessAccount.pancard &&
                  `Pan Card No: ${selectedBusinessAccount.pancard}`}{' '}
                <br />
                {currentBalance && `Current Balance: ${currentBalance}`}
              </CardText>
            </Card>
          )}
        </HorizontalBlock>
      </Fields>
    </FormBlock>
    <FormBlock width="50%">
      <FormBlockTitle>Voucher Types</FormBlockTitle>
      <Fields>
        <HorizontalBlock type="withErrors">
          <TextInputField
            width="130px"
            labelSize="2%"
            readOnly={true}
            labelText="Account Type"
            value={payload.accountType}
            errorText={
              addVoucherValidations.accountType && !addVoucherValidations.accountType.isValid
                ? addVoucherValidations.accountType.message
                : ''
            }
            onChange={updateAccountType}
          />

          <DateTime
            hint="Date"
            width="130px"
            labelText="Issue Date"
            value={issueDateObj}
            onChange={date => updateDate(date)}
          />
        </HorizontalBlock>

        <HorizontalBlock type="withErrors">
          <TextInputField
            width="130px"
            labelSize="2%"
            hint="Voucher No"
            labelText="Voucher No"
            value={payload.voucherNo}
            errorText={
              addVoucherValidations.voucherNo && !addVoucherValidations.voucherNo.isValid
                ? addVoucherValidations.voucherNo.message
                : ''
            }
            onBlur={validateVoucherNo}
            onChange={value => updateVoucherNo(value)}
          />
        </HorizontalBlock>
      </Fields>
    </FormBlock>
  </FormRow>
);

export default AccountDetailsFields;
