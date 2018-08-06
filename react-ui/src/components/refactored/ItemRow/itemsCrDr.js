//TODO: we will remove this immediately after demo and work towards reusable lineItems functionality (configured from outside, readOnly line Items, +add Item optional settings)
//items and itemdcrDr should be same component and above changes should be configurable from above component

import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
  getItemsNames,
  getTempItems,
  getTotalQty,
  getSelectedVoucherDetails,
  getlineAmountSum
} from '../../../reducers/index';
import ItemHeaders from './ItemHeaders';

import {
  FormRow,
  FormBlock,
  AddItemText,
  FormBlockTitle,
  FieldsContainer,
  HorizontalFields
} from '../../Voucher/AddVoucherStyledComponents';
import {
  addNewLineItem,
  updateLineItemField,
  discountChange,
  deleteLineItem,
  lineItemIndex,
  toggleAddItems,
  updateLineItemNameCrDr
} from '../../../actions/index';

import { DeleteIcon, Percent, Rupees, Cancel } from '../../../images/index';
import { ItemTextInput } from '../../index';
import { StyledImg, ItemHeader } from '../../Voucher/AddVoucherStyledComponents';
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
class ItemsCrDr extends Component {
  state = {
    voucherItemsSuggestions: []
  };

  populateItemSuggestions = input => {
    const { voucherItemsSuggestions } = this.props;
    if (voucherItemsSuggestions == null) {
      alert('Please Select ref voucher Number');
      return;
    }
    this.setState({
      voucherItemsSuggestions
    });
  };

  render() {
    const {
      totalQty,
      lineAmountSum,
      tempItems,
      lineItemIndex,
      deleteLineItem,
      addNewLineItem,
      updateLineItemNameCrDr,
      updateLineItemField
    } = this.props;
    const { voucherItemsSuggestions } = this.state;
    return (
      <FormRow>
        <FormBlock width="100%">
          <FormBlockTitle>Items</FormBlockTitle>
          <FieldsContainer>
            <ItemHeaders />

            {tempItems &&
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
                            updateLineItemNameCrDr(input, key);
                            this.populateItemSuggestions(input);
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
                              if (Object.keys(tempItem).length > 0) {
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
                          onChange={value => updateLineItemField(key, value, 'qty')}
                        />

                        <ItemTextInput
                          hint="0.00"
                          type="number"
                          id={`price${key}`}
                          containerWidth="12.5%"
                          containerHeight="30px"
                          value={tempItem.unitSellPrice}
                          onFocus={() => lineItemIndex(key)}
                          readOnly={true}
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
                          onFocus={() => lineItemIndex(key)}
                          readOnly={true}
                        />
                        <ItemHeader width="3%" type="icon" container="icon">
                          <Img
                            height="14px"
                            weight="14px"
                            readOnly={true}
                            src={tempItem.discountIconChange ? Rupees : Percent}
                            onClick={() => discountChange(key)}
                          />
                        </ItemHeader>

                        <ItemTextInput
                          hint="0.00"
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
              })}
            <HorizontalFields type="spaceBetween" width="70px">
              <AddItemText type="addLine" addLineBtnVisibility={'true'} onClick={addNewLineItem}>
                Add Line +
              </AddItemText>

              <AddItemText addLineBtnVisibility={'true'}>
                {lineAmountSum ? `Qty: ${totalQty}` : `Qty: 0`}{' '}
              </AddItemText>
              <AddItemText addLineBtnVisibility={'true'}>
                {lineAmountSum ? `Line Amount: Rs ${lineAmountSum}` : `Line Amount: Rs 0.00`}{' '}
              </AddItemText>
            </HorizontalFields>
          </FieldsContainer>
        </FormBlock>
      </FormRow>
    );
  }
}

const mapsStateToProps = state => ({
  tempItems: getTempItems(state),
  totalQty: getTotalQty(state),
  voucherItemsSuggestions: getItemsNames(state),
  lineAmountSum: getlineAmountSum(state),
  selectedVoucher: getSelectedVoucherDetails(state)
});

export default connect(mapsStateToProps, {
  addNewLineItem,
  updateLineItemField,
  discountChange,
  deleteLineItem,
  lineItemIndex,
  toggleAddItems,
  updateLineItemNameCrDr
})(ItemsCrDr);
