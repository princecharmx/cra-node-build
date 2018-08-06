import React from 'react';

import { ItemHeader, HorizontalFields } from '../../Voucher/AddVoucherStyledComponents';

const ItemHeaders = () => {
  return (
    <HorizontalFields>
      {/* S.no is a textfield */}
      <ItemHeader width="2%" type="son">
        S.no
      </ItemHeader>
      {/* SKU is a textfield */}
      <ItemHeader width="15%" type="sku">
        SKU
      </ItemHeader>
      {/* Name is a AutoComplete */}
      <ItemHeader width="20.5%">Name</ItemHeader>
      {/* HSN is a textfield */}
      <ItemHeader width="10.5%">HSN</ItemHeader>
      {/* GST is a dropdown */}
      <ItemHeader width="7.5%">Tax (%)</ItemHeader>
      {/* Quantity is a textfield */}
      <ItemHeader width="7.75%">Qty</ItemHeader>
      {/* Price is a textfield */}
      <ItemHeader width="12.5%">Price/Unit</ItemHeader>
      {/* Units is a textfield */}
      <ItemHeader width="6.25%">Units</ItemHeader>
      {/* Discount is a combination of textfield & dropdown */}
      <ItemHeader width="14%">Discount</ItemHeader>
      {/* Subtotal is a textfield - automatically caclulated */}
      <ItemHeader width="14%">Amount</ItemHeader>
      {/* this is for delete icon */}
      <ItemHeader width="3%" container="icon" />
    </HorizontalFields>
  );
};

export default ItemHeaders;
