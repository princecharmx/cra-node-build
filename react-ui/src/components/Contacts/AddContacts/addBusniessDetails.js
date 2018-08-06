import React from 'react';

import { HandShake, Gst, Gstin } from '../../../images/index';
import { TextInputField, DateTime, Toggle } from '../../index';
import { Fields, HorizontalFields, Label } from './Styles';

const AddBusiness = ({
  payload,
  onBlurData,
  onChangeDate,
  toggleIsDebit,
  balanceDateObj,
  formValidations,
  onChangeAccountData,
  onChangeBusinessData
}) => {
  return (
    <div>
      <Fields>
        {/* remove reqired feild */}
        <TextInputField
          id="businessDataName"
          width="230px"
          hint="Joyalukkas India Pvt Ltd"
          labelSize="2px"
          imgSrc={HandShake}
          value={payload.businessData.name}
          labelText=" Legal Business Name*"
          errorText={
            formValidations.name && !formValidations.name.isValid
              ? formValidations.name.message
              : ''
          }
          onBlur={event => onBlurData(event, 'name')}
          onChange={value => onChangeBusinessData(value, 'name', 'businessData')}
        />

        <TextInputField
          width="230px"
          hint="Joyalukkas"
          labelSize="2%"
          imgSrc={Gst}
          labelText="Alias Business Name"
          id="businessDataAliasName"
          value={payload.businessData.aliasName}
          onChange={value => onChangeBusinessData(value, 'aliasName', 'businessData')}
        />
      </Fields>
      <HorizontalFields>
        <TextInputField
          hint="200"
          width="180px"
          labelSize="2%"
          imgSrc={Gstin}
          id="accountDataBalance"
          labelText="Opening Balance"
          value={payload.accountData.balance}
          onBlur={event => onBlurData(event, 'formValidations')}
          onChange={value => onChangeAccountData(value)}
          errorText={
            formValidations.balance && !formValidations.balance.isValid
              ? formValidations.balance.message
              : ''
          }
        />

        <Toggle
          id="creditDebitToggle"
          checked={payload.accountData.isDebit}
          onClick={() => {
            toggleIsDebit();
          }}
        />

        <div style={{ display: 'flex' }}>
          <Label>as of</Label>
          <DateTime
            width="100px"
            underline={false}
            marginOnTop="15px"
            id="balanceDateObj"
            value={balanceDateObj}
            onChange={date => onChangeDate(date)}
          />
        </div>
      </HorizontalFields>
    </div>
  );
};

export default AddBusiness;
