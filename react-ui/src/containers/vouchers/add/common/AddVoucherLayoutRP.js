import { connect } from 'react-redux';
import React from 'react';

import AddItems from '../../../AddItem';
import AddContacts from '../../../AddContact';
import { GoBack } from '../../../../images/index';
import { getOnShowAddItems } from '../../../../reducers';
import Voucher from '../../../../components/Voucher/VoucherBuilder';
import { togglePurchaseSalesCreationDrawer } from '../../../../actions';
import { TaxAnalysis } from '../../../../components/refactored/newUnHookedComponents/TaxAnalysis';

class AddVoucherLayoutRP extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <React.Fragment>
        <Voucher.Container>
          <Voucher.Header>
            <Voucher.ImageHolder src={GoBack} onClick={props.togglePurchaseSalesCreationDrawer} />
            <Voucher.Title>Add {props.type} Voucher</Voucher.Title>
            <Voucher.SaveButton onClikSaveButton={props.onSave} label={'Save'} />
          </Voucher.Header>

          <Voucher.Columns>
            <Voucher.LeftColumn>
              <div>
                {props.renderVoucherDetails && props.renderVoucherDetails()}
                {props.renderTransactionDetails && props.renderTransactionDetails()}
              </div>

              <Voucher.SummaryBlockPosition>
                {props.renderSummaryBlock && props.renderSummaryBlock()}
              </Voucher.SummaryBlockPosition>
            </Voucher.LeftColumn>

            <Voucher.RightColumn>
              {!props.viewTaxAnalysis ? (
                <Voucher.FlexContainer>
                  <Voucher.Section padding="1rem 0">
                    {props.renderPartyPicker && props.renderPartyPicker()}
                    {props.renderItemsList && props.renderItemsList()}
                    {props.renderAddAdditionalCharges && props.renderAddAdditionalCharges()}
                    {props.renderAddAdditionalChargesAfterTax &&
                      props.renderAddAdditionalChargesAfterTax()}
                  </Voucher.Section>
                  <Voucher.Bottom>
                    {props.renderNarrationBlock && props.renderNarrationBlock()}
                    {props.renderSummaryBlock && props.renderSummaryBlock()}
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
    onShowAddItems: getOnShowAddItems(state),
    viewTaxAnalysis: vouchers.app.summary.viewTaxAnalysis
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVoucherLayoutRP);
