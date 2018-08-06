import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer } from 'material-ui';

import * as CONSTANTS from '../../../constants';
import Voucher from '../../../components/Voucher/VoucherBuilder';
import AddVoucherLayoutSPCD from './common/AddVoucherLayoutSPCD';
import VoucherPicker from '../../../components/Voucher/VoucherPicker/Voucher';
import {
  updateVoucherTypes,
  toggleViewTaxAnalysis,
  updateNarration,
  onSaveDebitNote,
  onEditDebitNote,
  fetchPurchasesAccounts
} from '../../../actions';
import {
  getbusinessAccountsSuggestions,
  getSummaryBlockData,
  getNarrationValue,
  genrateCreditDebit,
  getopenAddDrawer
} from '../../../reducers';
import ItemsCrDr from '../../../components/refactored/ItemRow/itemsCrDr';
import {
  RenderVoucherDetails,
  RenderSummaryBlock
} from '../../../components/Voucher/AddVoucherCommon';

const RenderVoucherPicker = () => (
  <React.Fragment>
    <Voucher.SectionTitle>Purchase Voucher Ref Number</Voucher.SectionTitle>
    <VoucherPicker />
  </React.Fragment>
);

class AddPurchaseContainer extends Component {
  componentDidMount() {
    this.props.fetchPurchasesAccounts();
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
          mode={this.props.mode}
          type={CONSTANTS.VOUCHER_TYPE_PURCHASE}
          onSave={() => this.props.onSaveDebitNote(this.props.payload)}
          onEdit={() => this.props.onEditDebitNote(this.props.payload)}
          renderVoucherPicker={() => <RenderVoucherPicker />}
          renderVoucherDetails={() => (
            <RenderVoucherDetails fetchAccountsDetails={this.props.fetchPurchasesAccounts} />
          )}
          renderItemsList={() => <ItemsCrDr />}
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
        />
      </Drawer>
    );
  }
}

const mapStateToProps = state => ({
  payload: genrateCreditDebit(state),
  openAddDrawer: getopenAddDrawer(state),
  narration: getNarrationValue(state),
  summaryBlockData: getSummaryBlockData(state),
  businessAccountsSuggestions: getbusinessAccountsSuggestions(state)
});

export default connect(mapStateToProps, {
  onSaveDebitNote,
  onEditDebitNote,
  updateNarration,
  fetchPurchasesAccounts,
  updateVoucherTypes,
  toggleViewTaxAnalysis
})(AddPurchaseContainer);
