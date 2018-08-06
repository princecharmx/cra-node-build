import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer } from 'material-ui';

import * as CONSTANTS from '../../../constants';
import {
  updateVoucherTypes,
  onSaveSalesPurchaseVoucher,
  onEditSalesVoucher,
  toggleViewTaxAnalysis,
  updateNarration,
  fetchSalesAccounts
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
    this.props.fetchSalesAccounts();
  }
  render() {
    const { openAddDrawer, closeDrawer } = this.props;
    return (
      <Drawer
        width="90%"
        docked={false}
        open={openAddDrawer}
        openSecondary={true}
        onRequestChange={closeDrawer}
      >
        <AddVoucherLayoutSPCD
          type={CONSTANTS.VOUCHER_TYPE_SALES}
          onSave={() => this.props.onSaveSalesPurchaseVoucher(this.props.payload)}
          onEdit={() => this.props.onEditSalesVoucher(this.props.payload)}
          renderParty={() => (
            <RenderParty businessAccountsSuggestions={this.props.businessAccountsSuggestions} />
          )}
          renderVoucherDetails={() => <RenderVoucherDetails />}
          renderShippingDetails={() => <RenderShippingDetails />}
          renderItemsList={() => <VoucherItems renderItemsList={renderItemList} />}
          renderAddAdditionalCharges={() => <AddAdditionalCharges />}
          renderAddAdditionalChargesAfterTax={() => (
            <OtherChargesAfterTax accountNames={this.props.accountNames} />
          )}
          renderNarrationBlock={() => (
            <Voucher.NarrationBlock
              updateNarration={this.props.updateNarration}
              value={this.props.narration}
            />
          )}
          renderSummaryBlock={() => (
            <RenderSummaryBlock
              summaryBlockData={this.props.summaryBlockData}
              toggleViewTaxAnalysis={this.props.toggleViewTaxAnalysis}
            />
          )}
          renderTransportDetails={() => <RenderTransportDetails />}
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
  updateVoucherTypes,
  onSaveSalesPurchaseVoucher,
  onEditSalesVoucher,
  toggleViewTaxAnalysis,
  fetchSalesAccounts
})(AddPurchaseContainer);
