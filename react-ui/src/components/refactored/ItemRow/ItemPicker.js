import React from 'react';
import { ItemAutoComplete } from '../../index';

const ItemPicker = ({
  voucherItemsSuggestions,
  itemKey,
  tempItem,
  setCurrentItemToFocus,
  updateLineItemName,
  tempItems,
  onFocus
}) => {
  return (
    <ItemAutoComplete
      width="50%"
      height="30px"
      hint="Add Line by item name or SKU code"
      id={`name${itemKey}`}
      onFocus={onFocus}
      dataSource={voucherItemsSuggestions}
      searchText={tempItems.itemName}
      onUpdateInput={input => updateLineItemName(input)}
    />
  );
};

export default ItemPicker;
