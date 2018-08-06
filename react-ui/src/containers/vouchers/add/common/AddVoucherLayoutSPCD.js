import { connect } from 'react-redux';
import React from 'react';

import AddItems from '../../../AddItem';
import * as CONSTANTS from '../../../../constants';
import AddContacts from '../../../AddContact';
import { GoBack } from '../../../../images/index';
import { getOnShowAddItems, getPath } from '../../../../reducers';
import Voucher from '../../../../components/Voucher/VoucherBuilder';
import { togglePurchaseSalesCreationDrawer } from '../../../../actions/index';
import { TaxAnalysis } from '../../../../components/refactored/newUnHookedComponents/TaxAnalysis';

/**
 * This is the skeleton componet for sales, purchase, credit, debit
 * if voucher is in edit mode an 'edit' props should be passed form the parent component
 * Remove voucher edit as well as create mode based on routes it should be passed from parent component
 *
 */
class AddVoucherLayoutSPCD extends React.PureComponent {
  render() {
    const {
      mode,
      type,
      onEdit,
      onSave,
      renderParty,
      viewTaxAnalysis,
      renderItemsList,
      renderSummaryBlock,
      renderVoucherPicker,
      renderVoucherDetails,
      renderNarrationBlock,
      renderShippingDetails,
      renderTransportDetails,
      renderAddAdditionalCharges,
      togglePurchaseSalesCreationDrawer,
      renderAddAdditionalChargesAfterTax
    } = this.props;
    return (
      <React.Fragment>
        <Voucher.Container>
          <Voucher.Header>
            <Voucher.ImageHolder src={GoBack} onClick={togglePurchaseSalesCreationDrawer} />
            <Voucher.Title>Add {type} Voucher</Voucher.Title>
            {/* if the mode is edit it will show edit other wise save , mode will be passed as props from parent component */}
            {mode === CONSTANTS.EDIT ? (
              <Voucher.SaveButton onClikSaveButton={onEdit} label={CONSTANTS.UPDATE} />
            ) : (
              <Voucher.SaveButton onClikSaveButton={onSave} label={CONSTANTS.SAVE} />
            )}
          </Voucher.Header>

          <Voucher.Columns>
            <Voucher.LeftColumn>
              <div>
                {renderParty && renderParty()}
                {renderVoucherPicker && renderVoucherPicker()}
                {renderVoucherDetails && renderVoucherDetails()}
                {renderShippingDetails && renderShippingDetails()}
                {/*dont show transport in edit mode  */}
                {mode === CONSTANTS.CREATE &&
                  renderTransportDetails &&
                  renderTransportDetails(mode)}
              </div>

              <Voucher.SummaryBlockPosition>
                {renderSummaryBlock && renderSummaryBlock()}
              </Voucher.SummaryBlockPosition>
            </Voucher.LeftColumn>

            <Voucher.RightColumn>
              {!viewTaxAnalysis ? (
                <Voucher.FlexContainer>
                  <Voucher.Section padding="1rem 0">
                    {renderItemsList && renderItemsList()}
                    {renderAddAdditionalCharges && renderAddAdditionalCharges()}
                    {renderAddAdditionalChargesAfterTax && renderAddAdditionalChargesAfterTax()}
                  </Voucher.Section>
                  <Voucher.Bottom>
                    {renderNarrationBlock && renderNarrationBlock()}
                    {renderSummaryBlock && renderSummaryBlock()}
                  </Voucher.Bottom>
                </Voucher.FlexContainer>
              ) : (
                <TaxAnalysis />
              )}
            </Voucher.RightColumn>
          </Voucher.Columns>
        </Voucher.Container>
        <AddItems
          openAddItem={this.props.onShowAddItems}
          itemCloseClick={() => this.setState({ openAddItems: false })}
        />
        <AddContacts />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  togglePurchaseSalesCreationDrawer
};

const mapStateToProps = state => {
  const { vouchers } = state;
  return {
    type: vouchers.type,
    pathname: getPath(state),
    onShowAddItems: getOnShowAddItems(state),
    viewTaxAnalysis: vouchers.app.summary.viewTaxAnalysis
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVoucherLayoutSPCD);
