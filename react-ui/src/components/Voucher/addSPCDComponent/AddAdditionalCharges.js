import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormRow, FormBlock, FormBlockTitle } from '../AddVoucherStyledComponents';
import { AddAditionalChargesFields } from './AddAdditionalChargesFields';

import {
  updateAmount,
  deleteCharges,
  updateAccount,
  addOtherCharges,
  setDiscountUnits,
  resetAddDiscount,
  setDiscountValue,
  toggleAddDiscount,
  drawerOpenAddAccounts,
  currentChargeIndexFocus,
  toggleOtherCharges
} from '../../../actions/index';
import { getAccountsName } from '../../../reducers/vouchers';
import { isEditMode } from '../../../reducers';
class AddAdditaional extends Component {
  constructor() {
    super();
    this.state = {
      otherChargesDataSource: []
    };
  }

  render() {
    const {
      voucher: { additionalDiscount },
      additionalDiscountCurrencyAmount,
      isEdit,
      _otherCharges,
      accountNames,
      onHideOtherCharges,
      addOtherCharges,
      deleteCharges,
      updateAccount,
      updateAmount,
      setDiscountUnits,
      setDiscountValue,
      addNewChargesLine,
      toggleAddDiscount,
      onHideAddDiscount,
      toggleOtherCharges,
      discountImg,
      currentChargeIndexFocus
    } = this.props;

    return (
      <FormRow type="fourthRow">
        <FormBlock width="100%">
          <FormBlockTitle>Other Charges</FormBlockTitle>
          <AddAditionalChargesFields
            isEditMode={isEdit}
            discountImg={discountImg}
            otherChargesInputData={_otherCharges}
            updateAmount={updateAmount}
            updateAccount={updateAccount}
            deleteCharges={deleteCharges}
            addOtherCharges={addOtherCharges}
            setDiscountUnits={setDiscountUnits}
            setDiscountValue={setDiscountValue}
            toggleAddDiscount={toggleAddDiscount}
            additionalDiscountCurrencyAmount={additionalDiscountCurrencyAmount}
            addNewChargesLine={addNewChargesLine}
            onHideAddDiscount={onHideAddDiscount}
            onHideOtherCharges={onHideOtherCharges}
            additionalDiscount={additionalDiscount}
            toggleOtherCharges={toggleOtherCharges}
            currentChargeIndexFocus={currentChargeIndexFocus}
            //TODO: hook redux  accounts data sources in this place
            otherChargesDataSource={accountNames}
          />
        </FormBlock>
      </FormRow>
    );
  }
}

const mapStateToProps = state => {
  const {
    vouchers,
    vouchers: {
      _otherCharges,
      purchase: voucher,
      _voucherModuleResults: { additionalDiscountCurrencyAmount },
      app: { otherCharges: { onHideAddDiscount, onHideOtherCharges } }
    }
  } = state;
  return {
    voucher,
    additionalDiscountCurrencyAmount,
    _otherCharges,
    onHideAddDiscount,
    onHideOtherCharges,
    discountImg: voucher.additionalDiscount.unit,
    accountNames: getAccountsName(vouchers),
    isEdit: isEditMode(state)
  };
};

const mapDispatchToProps = {
  currentChargeIndexFocus,
  drawerOpenAddAccounts,
  toggleAddDiscount,
  setDiscountUnits,
  addOtherCharges,
  setDiscountValue,
  resetAddDiscount,
  deleteCharges,
  updateAccount,
  updateAmount,
  toggleOtherCharges
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAdditaional);
