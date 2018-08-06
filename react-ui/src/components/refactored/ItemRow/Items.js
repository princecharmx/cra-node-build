import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuItem } from 'material-ui';
import map from 'lodash';

import {
  getItemsNames,
  getTempItems,
  getTotalQty,
  getItems,
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
  setCreatedItemInLineItems,
  updateLineItemName
} from '../../../actions/index';

class Items extends Component {
  state = {
    voucherItemsSuggestions: [],
    itemsList: this.props.items,
    latestItem: []
  };

  // this logic is writen to populate the item that has been saved.
  // it filters latest items that has been newly created.
  //this function is is been depricated and will be removed.
  componentWillReceiveProps(nextProps) {
    if (this.props.items && nextProps.items && nextProps.items.length > this.props.items.length) {
      // create a array of id
      const prevStateIdArray = this.props.items.map(item => item.id);
      // filter item that is not in array.
      const filteredArray = nextProps.items.filter(
        item => _.indexOf(prevStateIdArray, item.id) < 0
      );
      this.setState(
        {
          latestItem: filteredArray
        },
        () => {
          this.props.setCreatedItemInLineItems(...this.state.latestItem);
        }
      );
    }
  }
  populateItemSuggestions = input => {
    const { voucherItemsSuggestions, toggleAddItems } = this.props;
    const value = map(voucherItemsSuggestions, item => {
      return {
        text: item.name,
        value: item.name
      };
    });

    const addItem = {
      text: `${input}`,
      value: (
        <MenuItem
          onClick={toggleAddItems}
          style={{ color: 'blue' }}
          primaryText={`Add Items ${input} +`}
        />
      )
    };
    this.setState({
      voucherItemsSuggestions: [...value, addItem]
    });
  };

  render() {
    const {
      renderItemsList,
      totalQty,
      lineAmountSum,
      tempItems,
      lineItemIndex,
      deleteLineItem,
      addNewLineItem,
      updateLineItemName,
      updateLineItemField
    } = this.props;
    const { voucherItemsSuggestions } = this.state;
    return (
      <FormRow>
        <FormBlock width="100%">
          <FormBlockTitle>Items</FormBlockTitle>
          <FieldsContainer>
            <ItemHeaders />

            {renderItemsList &&
              renderItemsList(
                tempItems,
                lineItemIndex,
                discountChange,
                deleteLineItem,
                updateLineItemName,
                updateLineItemField,
                voucherItemsSuggestions,
                this.populateItemSuggestions
              )}

            <HorizontalFields type="spaceBetween" width="70px">
              <AddItemText type="addLine" addLineBtnVisibility={'true'} onClick={addNewLineItem}>
                Add Line +
              </AddItemText>

              <AddItemText addLineBtnVisibility={'true'} style={{ color: '#868686' }}>
                {lineAmountSum ? `Qty: ${totalQty}` : `Qty: 0`}{' '}
              </AddItemText>
              <AddItemText addLineBtnVisibility={'true'} style={{ color: '#868686' }}>
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
  items: getItems(state),
  voucherItemsSuggestions: getItemsNames(state),
  lineAmountSum: getlineAmountSum(state)
});

export default connect(mapsStateToProps, {
  addNewLineItem,
  updateLineItemField,
  discountChange,
  deleteLineItem,
  lineItemIndex,
  toggleAddItems,
  setCreatedItemInLineItems,
  updateLineItemName
})(Items);
