import {
  UPDATE_VOUCHER_NO,
  UPDATE_NARRATION,
  CLOSE_BUSINESS_CARD,
  UPDATE_PIN_CODE,
  UPDATE_CITY,
  UPDATE_STATE,
  ACCOUNTS_NAME,
  DRAWER_OPEN_ADD_ACCOUNTS,
  ON_FOCUS_CURRENT_INDEX,
  RESET_ADD_DISCOUNT
} from './types';

const updateVoucherNo = payload => {
  return {
    type: UPDATE_VOUCHER_NO,
    payload: payload
  };
};

// const onUpdateBranchInput = payload => {

// };

const updateNarration = payload => {
  return {
    type: UPDATE_NARRATION,
    payload: payload
  };
};

const updatePincode = payload => {
  return {
    type: UPDATE_PIN_CODE,
    payload: payload
  };
};

const updateCity = payload => {
  return {
    type: UPDATE_CITY,
    payload: payload
  };
};

const updateState = payload => {
  return {
    type: UPDATE_STATE,
    payload: payload
  };
};

// const addOtherChargesAfterTax = () => {
//   return {
//     type: ADD_LINE
//   };
// };

const storeAccountsName = payload => {
  return {
    type: ACCOUNTS_NAME,
    payload: payload
  };
};

const drawerOpenAddAccounts = () => {
  return {
    type: DRAWER_OPEN_ADD_ACCOUNTS
  };
};

const onFocus = payload => {
  return {
    type: ON_FOCUS_CURRENT_INDEX,
    payload: payload
  };
};

const resetAddDiscount = () => {
  return {
    type: RESET_ADD_DISCOUNT
  };
};

export {
  updateVoucherNo,
  updateNarration,
  updatePincode,
  updateCity,
  updateState,
  // addOtherChargesAfterTax,
  storeAccountsName,
  drawerOpenAddAccounts,
  onFocus,
  resetAddDiscount
};
