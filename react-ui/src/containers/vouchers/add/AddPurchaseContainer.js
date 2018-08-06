import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer } from 'material-ui';

import * as CONSTANTS from '../../../constants';
import {
  updateVoucherTypes,
  onSaveSalesPurchaseVoucher,
  toggleViewTaxAnalysis,
  updateNarration,
  fetchPurchasesAccounts,
  onEditPurchaseVoucher
} from '../../../actions';
import Voucher from '../../../components/Voucher/VoucherBuilder';
import AddVoucherLayoutSPCD from './common/AddVoucherLayoutSPCD';
import {
  getbusinessAccountsSuggestions,
  genratePurchaseSalesPayload,
  getSummaryBlockData,
  getNarrationValue,
  getopenAddDrawer
} from '../../../reducers';
import {
  OtherChargesAfterTax,
  AddAdditionalCharges
} from '../../../components/Voucher/addSPCDComponent/index';
import VoucherItems from '../../../components/refactored/ItemRow/Items';
import ItemList from '../../../components/refactored/ItemRow/ItemList';
import {
  RenderParty,
  RenderVoucherDetails,
  RenderShippingDetails,
  RenderSummaryBlock,
  RenderTransportDetails
} from '../../../components/Voucher/AddVoucherCommon';

const renderItemList = (
  tempItems,
  lineItemIndex,
  discountChange,
  deleteLineItem,
  updateLineItemName,
  updateLineItemField,
  voucherItemsSuggestions,
  populateItemSuggestions
) => (
  <ItemList
    tempItems={tempItems}
    lineItemIndex={lineItemIndex}
    discountChange={discountChange}
    deleteLineItem={deleteLineItem}
    updateLineItemName={updateLineItemName}
    updateLineItemField={updateLineItemField}
    voucherItemsSuggestions={voucherItemsSuggestions}
    populateItemSuggestions={populateItemSuggestions}
  />
);

class AddPurchaseContainer extends Component {
  componentDidMount() {
    this.props.fetchPurchasesAccounts();
  }
  render() {
    const {
      mode,
      payload,
      narration,
      closeDrawer,
      accountNames,
      openAddDrawer,
      summaryBlockData,
      toggleViewTaxAnalysis,
      onEditPurchaseVoucher,
      onSaveSalesPurchaseVoucher,
      businessAccountsSuggestions
    } = this.props;
    return (
      <Drawer
        width="90%"
        docked={false}
        open={openAddDrawer}
        openSecondary={true}
        onRequestChange={closeDrawer}
      >
        <AddVoucherLayoutSPCD
          mode={mode}
          type={CONSTANTS.VOUCHER_TYPE_PURCHASE}
          onSave={() => {
            onSaveSalesPurchaseVoucher(payload);
          }}
          onEdit={() => {
            onEditPurchaseVoucher(payload);
          }}
          renderParty={() => (
            <RenderParty businessAccountsSuggestions={businessAccountsSuggestions} mode={mode} />
          )}
          renderVoucherDetails={() => <RenderVoucherDetails mode={mode} />}
          renderShippingDetails={() => <RenderShippingDetails mode={mode} />}
          renderItemsList={() => <VoucherItems renderItemsList={renderItemList} mode={mode} />}
          renderAddAdditionalCharges={() => <AddAdditionalCharges mode={mode} />}
          renderAddAdditionalChargesAfterTax={() => (
            <OtherChargesAfterTax accountNames={accountNames} mode={mode} />
          )}
          renderNarrationBlock={() => (
            <Voucher.NarrationBlock
              updateNarration={updateNarration}
              value={narration}
              mode={mode}
            />
          )}
          renderSummaryBlock={() => (
            <RenderSummaryBlock
              mode={mode}
              summaryBlockData={summaryBlockData}
              toggleViewTaxAnalysis={toggleViewTaxAnalysis}
            />
          )}
          renderTransportDetails={() => <RenderTransportDetails mode={mode} />}
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => ({
  payload: genratePurchaseSalesPayload(state.vouchers, state.companies),
  openAddDrawer: getopenAddDrawer(state),
  narration: getNarrationValue(state),
  summaryBlockData: getSummaryBlockData(state),
  businessAccountsSuggestions: getbusinessAccountsSuggestions(state)
});

export default connect(mapStateToProps, {
  updateNarration,
  onSaveSalesPurchaseVoucher,
  updateVoucherTypes,
  toggleViewTaxAnalysis,
  fetchPurchasesAccounts,
  onEditPurchaseVoucher
})(AddPurchaseContainer);
