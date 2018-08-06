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
  onSaveCreditNote,
  onEditCreditNote,
  fetchSalesAccounts
} from '../../../actions';
import {
  getbusinessAccountsSuggestions,
  getSummaryBlockData,
  getNarrationValue,
  genrateCreditDebit,
  getopenAddDrawer
} from '../../../reducers';
import { VoucherDetailsFields } from '../../../components/Voucher/addSPCDComponent/index';
import ItemsCrDr from '../../../components/refactored/ItemRow/itemsCrDr';

const RenderVoucherDetails = fetchAccountsDetails => (
  <React.Fragment>
    <Voucher.SectionTitle>Voucher Details</Voucher.SectionTitle>
    <VoucherDetailsFields {...fetchAccountsDetails} />
  </React.Fragment>
);

const RenderVoucherPicker = () => (
  <React.Fragment>
    <Voucher.SectionTitle>Sales Voucher Ref Number</Voucher.SectionTitle>
    <VoucherPicker />
  </React.Fragment>
);
const RenderSummaryBlock = ({
  summaryBlockData: { billTaxAmount, billFinalAmount, roundoffValue },
  toggleViewTaxAnalysis
}) => (
  <Voucher.SummaryBlock
    billTaxAmount={billTaxAmount}
    billFinalAmount={billFinalAmount}
    roundoffValue={roundoffValue}
    toggleViewTaxAnalysis={toggleViewTaxAnalysis}
  />
);

class AddCreditContainer extends Component {
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
          mode={this.props.mode}
          onSave={() => this.props.onSaveCreditNote(this.props.payload)}
          onEdit={() => this.props.onEditCreditNote(this.props.payload)}
          renderVoucherPicker={() => <RenderVoucherPicker mode={this.props.mode} />}
          renderVoucherDetails={() => (
            <RenderVoucherDetails
              fetchAccountsDetails={this.props.fetchSalesAccounts}
              mode={this.props.mode}
            />
          )}
          renderItemsList={() => <ItemsCrDr mode={this.props.mode} />}
          renderNarrationBlock={() => (
            <Voucher.NarrationBlock
              updateNarration={this.props.updateNarration}
              value={this.props.narration}
              mode={this.props.mode}
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
  onSaveCreditNote,
  onEditCreditNote,
  updateNarration,
  fetchSalesAccounts,
  updateVoucherTypes,
  toggleViewTaxAnalysis
})(AddCreditContainer);
