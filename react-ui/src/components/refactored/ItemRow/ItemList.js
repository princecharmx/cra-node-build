import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { DeleteIcon, Percent, Rupees, Cancel } from '../../../images/index';
import { ItemTextInput } from '../../index';
import { StyledImg, ItemHeader, HorizontalFields } from '../../Voucher/AddVoucherStyledComponents';
import ItemPicker from './ItemPicker';
const Img = styled.img`
  height: 15px;
  width: 14px;
  disable: ${p => (p.disable === 'true' ? true : false)};
  padding-bottom: 4px;
  &: hover {
    cursor: pointer;
  }
`;

const ItemCoreStyle = styled(Link)`
  width: 50%;
  color: #ccc;
  display: flex;
  border-style: solid;
  border-width: 1px;
  border-radius: 15px;
  overflow: hidden;
`;

const handleOnBlurDiscount = (value, updateLineItemField, key, discountValueStr) => {
  if (value === '') {
    return updateLineItemField(key, 0, discountValueStr);
  }
};

const handleOnFocusDiscount = (value, updateLineItemField, key, discountValueStr) => {
  if (value === 0) {
    return updateLineItemField(key, '', discountValueStr);
  }
};

const ItemsList = ({
  tempItems,
  updateLineItemName,
  voucherItemsSuggestions,
  lineItemIndex,
  updateLineItemField,
  populateItemSuggestions,
  discountChange,
  deleteLineItem,
  renderAddLineItems
}) => {
  return (
    tempItems &&
    tempItems.map((tempItem, key) => {
      return (
        <HorizontalFields type="values" key={key}>
          <ItemHeader width="3%" height="0" type="name">
            {`${key + 1}`}
          </ItemHeader>
          {tempItem.showItemPicker ? (
            <HorizontalFields>
              <ItemPicker
                tempItem={`${tempItem}`}
                itemKey={`${key}`}
                tempItems={tempItems}
                onFocus={() => lineItemIndex(key)}
                updateLineItemName={input => {
                  updateLineItemName(input, key);
                  populateItemSuggestions(input);
                }}
                voucherItemsSuggestions={voucherItemsSuggestions}
              />
              <ItemHeader width="3%" type="icon" container="icon">
                <StyledImg
                  src={Cancel}
                  height="14px"
                  weight="14px"
                  disable={Object.keys(tempItem).length === 1 ? 'true' : 'false'}
                  onClick={() => {
                    if (Object.keys(tempItem).length > 1) {
                      deleteLineItem(key);
                    }
                  }}
                />
              </ItemHeader>
            </HorizontalFields>
          ) : (
            <HorizontalFields>
              <ItemCoreStyle to="#">
                <ItemTextInput
                  isInputDescription={true}
                  readOnly={true}
                  id={`sku${key}`}
                  containerWidth="24%"
                  containerHeight="30px"
                  value={tempItem.itemSkuBarCode}
                />

                <ItemTextInput
                  isInputDescription={true}
                  hint="Item Name"
                  readOnly={true}
                  id={`name${key}`}
                  containerWidth="37%"
                  containerHeight="30px"
                  value={tempItem.itemName}
                />

                <ItemTextInput
                  isInputDescription={true}
                  readOnly={true}
                  id={`hsn${key}`}
                  containerWidth="24%"
                  containerHeight="30px"
                  value={tempItem.hsn}
                />

                <ItemTextInput
                  isInputDescription={true}
                  hint="AB24J2"
                  readOnly={true}
                  id={`tax${key}`}
                  containerWidth="10%"
                  containerHeight="30px"
                  value={tempItem.taxPercentage ? tempItem.taxPercentage : 0}
                />
              </ItemCoreStyle>
              <ItemTextInput
                hint="20"
                type="number"
                id={`qty${key}`}
                containerWidth="7.75%"
                containerHeight="30px"
                value={tempItem.qty}
                onFocus={() => lineItemIndex(key)}
                onChange={value => updateLineItemField(key, value, 'qty')}
              />

              <ItemTextInput
                hint="2000"
                type="number"
                id={`price${key}`}
                containerWidth="12.5%"
                containerHeight="30px"
                value={tempItem.unitSellPrice}
                onFocus={() => lineItemIndex(key)}
                onChange={value => updateLineItemField(key, value, 'unitSellPrice')}
              />

              <ItemTextInput
                hint="pcs"
                readOnly={true}
                id={`unit${key}`}
                containerWidth="6.25%"
                containerHeight="30px"
                value={tempItem.unit}
              />

              <ItemTextInput
                hint="15"
                type="number"
                id={`price${key}`}
                containerWidth="11%"
                containerHeight="30px"
                value={tempItem.discountValue}
                onBlur={() =>
                  handleOnBlurDiscount(
                    tempItem.discountValue,
                    updateLineItemField,
                    key,
                    'discountValue'
                  )
                }
                onFocus={() => {
                  lineItemIndex(key);
                  handleOnFocusDiscount(
                    tempItem.discountValue,
                    updateLineItemField,
                    key,
                    'discountValue'
                  );
                }}
                onChange={value => updateLineItemField(key, value, 'discountValue')}
              />
              <ItemHeader width="3%" type="icon" container="icon">
                <Img
                  height="14px"
                  weight="14px"
                  src={tempItem.discountIconChange ? Rupees : Percent}
                  onClick={() => discountChange(key)}
                />
              </ItemHeader>

              {renderAddLineItems && renderAddLineItems(lineItemIndex, updateLineItemField)}
              <ItemTextInput
                hint="20000"
                readOnly={true}
                id={`unit${key}`}
                containerWidth="14%"
                containerHeight="30px"
                value={tempItem.lineAmount}
              />
              <ItemHeader width="3%" type="icon" container="icon">
                <StyledImg
                  src={DeleteIcon}
                  height="14px"
                  weight="14px"
                  disable={Object.keys(tempItem).length === 1 ? 'true' : 'false'}
                  onClick={() => {
                    if (Object.keys(tempItem).length > 1) {
                      deleteLineItem(key);
                    }
                  }}
                />
              </ItemHeader>
            </HorizontalFields>
          )}
        </HorizontalFields>
      );
    })
  );
};
export default ItemsList;
