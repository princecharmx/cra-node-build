import React from 'react';
import map from 'lodash/map';

import { DeleteIcon, Percent, Rupees } from '../../../images/index';
import { ToggleForDiscountUnit } from '../../index';
import {
  ItemHeader,
  AddItemText,
  FieldsContainer,
  HorizontalFields
} from '../AddVoucherStyledComponents';
import { ItemTextInput, ItemAutoComplete } from '../../InputFields';
import { Img, SubContainer, HorizontalTwoFeilds } from '../addSPCDStyles/index';

const AddAditionalChargesFields = ({
  otherChargesDataSource,
  discountImg,
  otherChargesInputData,
  otherChargesFields,
  otherCharges,
  updateAccount,
  deleteCharges,
  accountNames,
  updateAmount,
  setDiscountUnits,
  setDiscountValue,
  additionalDiscountCurrencyAmount,
  onHideAddDiscount,
  toggleAddDiscount,
  addOtherCharges,
  additionalDiscount,
  onHideOtherCharges,
  toggleOtherCharges,
  currentChargeIndexFocus
}) => {
  return (
    <FieldsContainer>
      {!onHideAddDiscount ? (
        <HorizontalFields>
          <AddItemText
            addLineBtnVisibility="true"
            type="addLine"
            onClick={() => toggleAddDiscount()}
          >
            + Apply Addtional Discount
          </AddItemText>
        </HorizontalFields>
      ) : (
        <HorizontalTwoFeilds>
          <SubContainer>
            <AddItemText addLineBtnVisibility="true" type="text">
              Additional Discount
            </AddItemText>
            <ToggleForDiscountUnit
              id="additionalDiscountUnit"
              onClick={() => {
                setDiscountUnits();
              }}
            />
          </SubContainer>

          <SubContainer>
            <span
              style={{
                fontSize: '0.8125rem',
                marginTop: '0.625rem',
                fontStyle: 'italic',
                color: '#868686'
              }}
            >
              {additionalDiscount.unit === '%'
                ? '(Rs.' + additionalDiscountCurrencyAmount + ')'
                : null}
            </span>
            <ItemTextInput
              hint="Rs 100"
              containerWidth="100px"
              containerHeight="30px"
              value={additionalDiscount.value}
              onBlur={() => additionalDiscount.value === '' && setDiscountValue(0)}
              onFocus={() => additionalDiscount.value === 0 && setDiscountValue('')}
              onChange={value => setDiscountValue(value)}
            />
            <ItemHeader type="icon" container="icon">
              <Img
                src={DeleteIcon}
                height="14px"
                weight="14px"
                onClick={() => toggleAddDiscount()}
              />
            </ItemHeader>
          </SubContainer>
        </HorizontalTwoFeilds>
      )}

      {!onHideOtherCharges ? (
        <HorizontalFields>
          <AddItemText
            addLineBtnVisibility="true"
            type="addLine"
            onClick={() => toggleOtherCharges()}
          >
            + Apply Other Charges
          </AddItemText>
        </HorizontalFields>
      ) : (
        map(otherChargesInputData, (item, index) => (
          <HorizontalTwoFeilds key={`12349z${index}`}>
            <SubContainer>
              <ItemAutoComplete
                width="80px"
                height="30px"
                hint="Accounts"
                id={`name`}
                dataSource={otherChargesDataSource}
                searchText={otherChargesInputData[index].name}
                onFocus={() => {
                  currentChargeIndexFocus(index);
                  otherChargesInputData[index].amount === 0 && updateAmount('', index);
                }}
                onUpdateInput={input => updateAccount(input, index)}
              />
            </SubContainer>

            <SubContainer>
              <ItemTextInput
                containerWidth="80px"
                containerHeight="30px"
                value={otherChargesInputData[index].amount}
                onBlur={() => otherChargesInputData[index].amount === '' && updateAmount(0, index)}
                onFocus={() => otherChargesInputData[index].amount === 0 && updateAmount('', index)}
                onChange={input => {
                  updateAmount(input, index);
                }}
              />
              <ItemHeader type="icon" container="icon">
                <Img
                  src={DeleteIcon}
                  height="12px"
                  weight="12px"
                  onClick={() => deleteCharges(index)}
                />
              </ItemHeader>
            </SubContainer>
          </HorizontalTwoFeilds>
        ))
      )}
      {onHideOtherCharges && (
        <HorizontalFields>
          <AddItemText addLineBtnVisibility="true" type="addLine" onClick={() => addOtherCharges()}>
            + Apply OtherCharges
          </AddItemText>
        </HorizontalFields>
      )}
    </FieldsContainer>
  );
};

export { AddAditionalChargesFields };
