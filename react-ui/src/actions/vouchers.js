import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import { formatDate } from '../utils';

import {
  LAST_VISITED_VOUCHER,
  UPDATE_VOUCHERS,
  VOUCHER_DURATION_TYPE,
  UPDATE_VOUCHER_TYPES,
  VOUCHER_TYPE_PAYMENT,
  VOUCHER_TYPE_PURCHASE,
  VOUCHER_TYPE_SALES,
  VOUCHER_TYPE_CHALLAN,
  VOUCHER_TYPE_SCHALLAN
} from '../constants';

import {
  VOUCHER_DATE,
  FETCH_VOUCHERS_DATA,
  ON_HIDE_SHOW_LINK,
  SET_SELECTED_VOUCHER_ID,
  UPDATE_SHIPPING_ADDRESS,
  UPDATE_SHIPPING_FOR_SELECTED_VOUCHER,
  UPDATE_BUSINESS_CONTACT,
  POPULATE_ADDTIONAL_DISCOUNT,
  TOGGLE_SHIPPING_DETAILS_LINK,
  FETCH_UNPAID_VOUCHERS_SUCCESS,
  FETCH_UNPAID_VOUCHERS_FAILURE,
  SET_ROUND_OFF_VALUE,
  UPDATE_LINE_ITEM_CRDR,
  RESET_SHIPPING_DETAILS,
  HANDLE_VOUCHER_DETAILS_DONE,
  RESET_TRANSPORT_DETAILS,
  RESET_VOUCHER_DETAILS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILED,
  UPDATE_VOUCHERS_DETAILS_ACCOUNTS,
  ON_CLOSE_VOUCHER_PICKER,
  UPDATE_CURRENT_BALANCE,
  UPDATE_PARTY_NAME,
  UPDATE_ALL_BRANCHES,
  UPDATE_DATE,
  UPDATE_ACCOUNT,
  UPDATE_SELECTED_VOUCHER,
  FETCH_VOUCHER_BY_NUMBER_SUCCESS,
  FETCH_VOUCHER_BY_NUMBER_FAILURE,
  UPDATE_AMOUNT,
  FETCH_VOUCHER_SUCCESSED,
  FETCH_VOUCHER_FAILED,
  ADD_NEW_LINE_ITEM,
  CURRENT_CHARGE_INDEX_FOCUS,
  CURRENT_OTHER_CHARGES_AFTER_TAX_INDEX_FOCUS,
  ON_HIDE_OTHER_CHARGES,
  ON_HIDE_OTHER_CHARGES_AFTER_TAX,
  ADD_OTHER_CHARGES_AFTER_TAX_NEW_LINE,
  DELETE_LINE_ITEM,
  VOUCHERS_LIST_REQUESTED,
  GET_VOUCHER_REQUESTED,
  VOUCHERS_LIST_SUCCESS,
  VOUCHERS_LIST_FAILED,
  GET_VOUCHER_SUCCESS,
  GET_VOUCHER_FAILED,
  INCREMENT_VOUCHER_REQUESTED,
  INCREMENT_VOUCHER_SUCCESS,
  INCREMENT_VOUCHER_FAILED,
  UPDATE_TEMP_ITEM,
  LINE_ITEM_INDEX,
  UPDATE_TRANSPORT_DETAILS,
  ADD_OTHER_CHARGES_NEW_LINE,
  VIEW_TAX_ANALYSIS,
  DELETE_CHRAGES,
  DELETE_OTHER_CHRAGES_AFTER_TAX,
  TOGGLE_ADD_DISCOUNT,
  GENERATE_VOUCHER_PDF_REQUESTED,
  GENERATE_VOUCHER_PDF_SUCCESS,
  GENERATE_VOUCHER_PDF_FAILED,
  SET_VOUCHER_TYPE,
  UPDATE_FILTERED_NAMES,
  UPDATE_CHARGES,
  TOGGLE_PURCHASE_SALES_DRAWER,
  SET_DISCOUNT_UNITS,
  SET_DISCOUNT_VALUE,
  UPDATE_LINE_ITEM_FIELD,
  DISCOUNT_CHANGE,
  HANDLE_ITEM_CALCULATIONS,
  UPDATE_TAX_BRACKUP,
  BRANCH_SEARCH_TEXT,
  GET_BRANCH_SUCCESS,
  GET_BRANCH_FAILED,
  HANDLE_TRANSPORT_DONE,
  SET_SHIPPING_ADDRESS,
  SAVED_VOUCHER_SUCCESS,
  POPULATE_OTHER_CHARGES,
  HIDE_SHIPPING_DETAILS,
  RESET_VOUCHER_LINE_ITEMS,
  CLOSE_BUSINESS_CARD
} from './types';

import { serverError } from '../api/server';
import * as api from '../api/vouchers';
import VoucherCalModule from 'voucher-calculation';

import { objectToArray, getBranchId } from '../utils';
import { navigate } from './nav';

const VoucherRefCal = VoucherCalModule.refCalFunc;

const setLastVisitedVoucher = payload => {
  return {
    type: LAST_VISITED_VOUCHER,
    payload: payload
  };
};

const getShareVoucherData = (refId, selectedVoucherId) => (dispatch, getState) => {
  // const companyId = getState().currentCompany.id;
  const { currentCompany: { id } } = getState();

  return api.fetchShareVoucherData(id, refId, selectedVoucherId);
};

const handleTransportDone = () => {
  return {
    type: HANDLE_TRANSPORT_DONE
  };
};
const updateSelectedVoucher = input => {
  return {
    type: UPDATE_SELECTED_VOUCHER,
    input
  };
};
const fetchVouchersByNumber = input => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api
    .fetchVoucher(id, input)
    .then(
      response =>
        response &&
        dispatch({
          type: FETCH_VOUCHER_BY_NUMBER_SUCCESS,
          response
        })
    )
    .catch(error =>
      dispatch({
        type: FETCH_VOUCHER_BY_NUMBER_FAILURE,
        error
      })
    );
};

const updateBusiness = payload => (dispatch, getState) => {
  const { vouchers: { type } } = getState();
  dispatch({
    type: UPDATE_BUSINESS_CONTACT,
    payload: payload
  });
  if (type === 'payment' || type === 'receipt') {
    dispatch(fetchUnpaidVouchers());
  }
};

/**
 * This function gets called only from view, for populating the feilds inorder to edit
 * the voucher.
 *
 * TODO: check for bill final amout and calculated bill final amount form calculate voucher module
 */
const setVoucherDetailsOnCreationDrawer = (selectedVoucher, id) => (dispatch, getState) => {
  dispatch(setCreditDebitDetailsOnCreationDrawer(selectedVoucher, id));
  dispatch(updateShipppingDetails(selectedVoucher.shippingAddress));
};

const setCreditDebitDetailsOnCreationDrawer = (selectedVoucher, id) => dispatch => {
  dispatch({ type: ON_HIDE_SHOW_LINK });
  dispatch({ type: SET_SELECTED_VOUCHER_ID, id });
  dispatch({
    type: UPDATE_BUSINESS_CONTACT,
    payload: {
      business: {
        aliasName: selectedVoucher.party.accountName,
        ...selectedVoucher.party
      },
      party: selectedVoucher.party
    }
  });
  dispatch(updateDate(null, selectedVoucher.issueDate));
  dispatch(updateVouchersDetailsAccount(selectedVoucher.refAccountGroup));
  dispatch(populateLintItemForEditMode(selectedVoucher.itemList));

  dispatch(handleVoucherDetaislDone());
  dispatch(toggleAddDiscount()); // toggle addDiscount in 'edit mode'
  dispatch(populateAdditionalDiscount(selectedVoucher.additionalDiscount));
  dispatch(populateOtherChargesObject(selectedVoucher.otherCharges));
  dispatch(handleItemCalculations());
};

/**
 * ction to be fired from 'edit mode' to populate other charges
 * @param {otherChragesArray} otherChragesArray is array to be populated for other
 */
const populateOtherChargesObject = otherChragesArray => ({
  type: POPULATE_OTHER_CHARGES,
  otherChragesArray
});

/**
 * action to be fired from 'edit mode' to populate additional discount
 * @param {additionalDiscount} additionalDiscount is the value to populate in addtional discount
 */
const populateAdditionalDiscount = additionalDiscount => ({
  type: POPULATE_ADDTIONAL_DISCOUNT,
  additionalDiscount
});

// action to be fired from 'edit mode'
const populateLintItemForEditMode = lineItems => dispatch => {
  dispatch({
    type: UPDATE_TEMP_ITEM,
    edit: true,
    lineItems
  });
  lineItems && dispatch(handleItemCalculations());
};
const updateShipppingDetails = address => {
  return {
    type: UPDATE_SHIPPING_FOR_SELECTED_VOUCHER,
    address
  };
};

const showShippingDetails = () => {
  return {
    type: TOGGLE_SHIPPING_DETAILS_LINK
  };
};
//logic for fetching salse and purchase voucher which will populate in receipt and payment vouchers
// type is defined here and not send from top cause actions are dispatched in a chain and this actions is being dispatched from another actions.
const fetchUnpaidVouchers = () => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { type, _selectedBusinessAccount: { id: businessId } }
  } = getState();
  const voucherType = type === VOUCHER_TYPE_PAYMENT ? VOUCHER_TYPE_PURCHASE : VOUCHER_TYPE_SALES;
  businessId &&
    api
      .fetchUnpaidVoucher(voucherType, businessId, companyId)
      .then(response => {
        dispatch({ type: FETCH_UNPAID_VOUCHERS_SUCCESS, response, key: '_unpaidVoucherList' });
      })
      .catch(error => dispatch({ type: FETCH_UNPAID_VOUCHERS_FAILURE, error, key: 'error' }));
};
const updateVouchers = payload => {
  return {
    type: UPDATE_VOUCHERS,
    payload: payload
  };
};

const setVoucherDurationType = payload => {
  return {
    type: VOUCHER_DURATION_TYPE,
    payload: payload
  };
};

const updateVoucherTypes = payload => {
  return {
    type: UPDATE_VOUCHER_TYPES,
    payload: payload
  };
};

const setVoucherType = payload => {
  return {
    type: SET_VOUCHER_TYPE,
    payload: payload
  };
};

const setDate = (startDate, endDate) => {
  return {
    type: VOUCHER_DATE,
    date: {
      startDate: startDate,
      endDate: endDate
    }
  };
};

const hideShippingDetailsLink = () => ({ type: HIDE_SHIPPING_DETAILS });
const toggleAddDiscount = () => ({
  type: TOGGLE_ADD_DISCOUNT
});

const updateTransportDetails = (field, value) => {
  return {
    type: UPDATE_TRANSPORT_DETAILS,

    details: {
      [field]: value
    }
  };
};

const updateDate = (event, date) => {
  let tempDate = formatDate(date);
  return {
    type: UPDATE_DATE,
    payload: {
      date: date,
      tempDate: tempDate
    }
  };
};
const togglePurchaseSalesCreationDrawer = () => ({
  type: TOGGLE_PURCHASE_SALES_DRAWER
});
const deleteLineItem = key => (dispatch, getState) => {
  dispatch({
    type: DELETE_LINE_ITEM,
    key
  });

  dispatch({
    type: UPDATE_TAX_BRACKUP,
    payload: {
      taxBreakup: [],
      totalTax: ''
    }
  });
  dispatch(handleItemCalculations('delete'));
};

const fetchAllAccounts = () => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api
    .fetchAllAccounts(id)
    .then(response => dispatch({ type: FETCH_ACCOUNTS_SUCCESS, response }))
    .catch(error => dispatch({ type: FETCH_ACCOUNTS_FAILED, error }));
};

const fetchSalesAccounts = () => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api
    .fetchSalesAccounts(id)
    .then(response => dispatch({ type: FETCH_ACCOUNTS_SUCCESS, response }))
    .catch(error => dispatch({ type: FETCH_ACCOUNTS_FAILED, error }));
};

const fetchPurchasesAccounts = () => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api
    .fetchPurchasesAccounts(id)
    .then(response => dispatch({ type: FETCH_ACCOUNTS_SUCCESS, response }))
    .catch(error => dispatch({ type: FETCH_ACCOUNTS_FAILED, error }));
};

const fetchReceiptPaymentAccounts = () => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  Promise.all([api.fetchCashInHandAccounts(id), api.fetchBankAccounts(id)])
    .then(function([cashInHand, bankAccounts]) {
      let response = [];
      if (cashInHand != null) {
        response = cashInHand.concat(bankAccounts);
      }
      dispatch({ type: FETCH_ACCOUNTS_SUCCESS, response });
    })
    .catch(error => dispatch({ type: FETCH_ACCOUNTS_FAILED, error }));
};

const updateVouchersDetailsAccount = input => {
  return {
    type: UPDATE_VOUCHERS_DETAILS_ACCOUNTS,
    input
  };
};

const setShippingAddress = () => ({
  type: SET_SHIPPING_ADDRESS
});

const closeBusinessContactCard = () => {
  return {
    type: CLOSE_BUSINESS_CARD
  };
};

/**
 * this function resets all the add voucher state
 * this is being called from vouchers.js and and post success response form
 * the voucher.
 */
const resetVoucher = () => dispatch => {
  dispatch(resetVoucherLineItems());
  dispatch(closeBusinessContactCard());
  dispatch(resetShippingDetails());
  dispatch(resetVoucherDetails());
  dispatch(resetTransportDetails());
};
//reset voucher actions in reducers
const resetVoucherLineItems = () => ({
  type: RESET_VOUCHER_LINE_ITEMS
});
const resetShippingDetails = () => {
  return {
    type: RESET_SHIPPING_DETAILS
  };
};
const resetVoucherDetails = () => {
  return {
    type: RESET_VOUCHER_DETAILS
  };
};

const resetTransportDetails = () => {
  return {
    type: RESET_TRANSPORT_DETAILS
  };
};
// const resetLineItems = () => {
//   return {
//     type: RESET_LINE_ITEMS_DETAILS
//   };
// };

// const resetAddtionalDiscount = () => {
//   return {
//     type: RESET_ADDTIONAL_DISCOUNT
//   };
// };

//end
// reset actions for line items,
const onCloseVoucherPicker = () => ({
  type: ON_CLOSE_VOUCHER_PICKER
});
const fetchCurrentBalance = selectedBusinessAccountId => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api
    .currentBalance(id, selectedBusinessAccountId)
    .then(response => dispatch({ type: UPDATE_CURRENT_BALANCE, response }));
};

const updateBusinessContact = input => ({
  type: UPDATE_PARTY_NAME,
  input
});

const fetchBranches = () => (dispatch, getState) => {
  const { currentCompany: { id } } = getState();
  api.fetchBranch(id).then(response => dispatch({ type: UPDATE_ALL_BRANCHES, response }));
};

const updateLineItemNameCrDr = input => (dispatch, getState) => {
  const { vouchers: { _selectedVocuher } } = getState();
  const selectedItems =
    _selectedVocuher &&
    _selectedVocuher.lineItem &&
    _selectedVocuher.lineItem.filter(item => item.itemName === input)[0];
  selectedItems &&
    dispatch({
      type: UPDATE_LINE_ITEM_CRDR,
      selectedItems
    });
  selectedItems && dispatch(handleItemCalculations());
};

const updateLineItemName = input => (dispatch, getState) => {
  const { items: { items } } = getState();
  const selectedItems = items.filter(item => item.name === input)[0];

  selectedItems &&
    dispatch({
      type: UPDATE_TEMP_ITEM,
      payload: selectedItems
    });
  selectedItems && dispatch(handleItemCalculations());
};

const setDiscountValue = payload => dispatch => {
  dispatch({
    type: SET_DISCOUNT_VALUE,
    payload: payload
  });
  dispatch(handleItemCalculations());
};

const setDiscountUnits = () => dispatch => {
  dispatch({
    type: SET_DISCOUNT_UNITS
  });
  dispatch(handleItemCalculations());
};

const updateLineItemField = (key, value, keyName) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_LINE_ITEM_FIELD,
    key,
    updatedData: {
      [keyName]: value
    }
  });
  dispatch(handleItemCalculations());
};

const discountChange = payload => dispatch => {
  dispatch({
    type: DISCOUNT_CHANGE,
    payload: payload
  });
  dispatch(handleItemCalculations());
};

const updateCharges = (amount, index) => dispatch => {
  dispatch({
    type: UPDATE_CHARGES,
    payload: {
      amount: amount,
      index: index
    }
  });
  dispatch(handleItemCalculations());
};
// const updateAccountField = (input, index, accountNames) => (dispatch, getState) => {
//   const { vouchers } = getState();
//   const value = accountNames.map(items => {
//     return {
//       text: items.name,
//       value: items.name
//     };
//   });

//   const filteredNames = accountNames.filter(item => item.name === input);
//   dispatch({
//     type: UPDATE_ACCOUNT_FIELD,
//     payload: {
//       index: index,
//       input: input,
//       value: value
//     }
//   });

//   filteredNames.map(item =>
//     dispatch({
//       type: UPDATE_FILTERED_NAMES,
//       payload: {
//         index: vouchers.purchase.currentAfterTaxIndex,
//         item: item,
//         refPath: item.path
//       }
//     })
//   );
//   dispatch(handleItemCalculations());
// };

const updateAccountField = (input, index) => (dispatch, getState) => {
  const { vouchers: { accountsName } } = getState();
  const data = accountsName.filter(account => account.name === input).map(data => ({
    refAccountId: data.id,
    name: input,
    accountGroupName: data.accountGroupName,
    description: data.description,
    refPath: data.path,
    creditAmount: 0,
    debitAmount: 0
  }))[0];
  data &&
    dispatch({
      type: UPDATE_FILTERED_NAMES,
      data: { ...data }
    });
};

//voucher-calculation module hook

/**
 *  this  functions handles add voucher calculations,
 *  lineItems array has   to  be  set as  ref in  setRefItemList()  function  provided  by  voucher-calculation,
 *  otherCharges array has   to  be  set as  ref in  setRefOtherChargesList()  function  provided  by  voucher-calculation,
 *  adjustments array has   to  be  set as  ref in  setAdjustments()  function  provided  by  voucher-calculation,
 *  otherChargesAfterTax array has   to  be  set as  ref in  setRefOtherChargesAfterTaxList()  function  provided  by  voucher-calculation,
 */
const handleItemCalculations = (actionType, offSetValue) => (dispatch, getState) => {
  const {
    vouchers,
    vouchers: {
      _lineItems,
      _otherCharges,
      _otherChargesAfterTax,
      _voucherModuleResults: { autoPopulateRoundoffData: autoPopulateArray },
      app: { lineItem: { currentItemIndex: indexKey, lineItemCount } }
    }
  } = getState();

  //TODO: this is for demo, fix for module error unitSellPrice not defiend
  const itemsList = map(_lineItems, lineItem => {
    if (lineItem.unitSellPrice === undefined) {
      return {
        ...lineItem,
        unitSellPrice: lineItem.unitPurchasePrice,
        qty: lineItem.qty ? lineItem.qty : 1 //
      };
    }
    return {
      ...lineItem,
      qty: lineItem.qty ? lineItem.qty : 1 //
    };
  }).filter(item => item !== undefined); //remove undefined from array
  //const arrItems = objectToArray(_lineItems);
  const arrItems = itemsList;
  const arrOtherCharges = objectToArray(_otherCharges);
  const arrOtherChargesAfterTax = objectToArray(_otherChargesAfterTax);
  const paidAmount = parseFloat(vouchers.paidAmount) || 0;
  const adjustments =
    offSetValue && Boolean(autoPopulateArray.length)
      ? autoPopulateArray.filter(autoPopulate => autoPopulate.outputValue === offSetValue)[0].offset
      : null;
  //set reference for voucher-calculation module

  VoucherRefCal.setRefItemList(arrItems);
  //TODO: set adjustments in redux state properly currently getting undefined
  //TODO: party state ref not  set
  VoucherRefCal.setAdjustments(adjustments);
  VoucherRefCal.setAdditionalDiscount(vouchers.purchase.additionalDiscount);
  //VoucherCalculation.setShippingCharges(vouchers.purchase.payload.shippingCharges);
  VoucherRefCal.setRefOtherChargesList(arrOtherCharges);
  VoucherRefCal.setRefOtherChargesAfterTaxList(arrOtherChargesAfterTax);

  //calculated values we will receive from voucher-calculation module
  let lineItemsAddedObj = {};
  let lineItemsAddedObjNew = {};

  if (actionType !== 'delete') {
    lineItemsAddedObj = {
      qtySellPrice: VoucherRefCal.calculateLineQtySellPrice(indexKey),
      taxAmount: VoucherRefCal.calculateLineTax(indexKey),
      lineAmount: VoucherRefCal.calculateLineAmount(indexKey),
      discountAmount: VoucherRefCal.calculatedLineDiscount(indexKey)
    };
    for (let i = 0; i <= lineItemCount; i++) {
      Object.assign(lineItemsAddedObjNew, {
        [i]: {
          qtySellPrice: VoucherRefCal.calculateLineQtySellPrice(i),
          taxAmount: VoucherRefCal.calculateLineTax(i),
          lineAmount: VoucherRefCal.calculateLineAmount(i),
          discountAmount: VoucherRefCal.calculatedLineDiscount(i)
        }
      });
    }
  }
  //console.log('lineItemsAddedObjNew',lineItemsAddedObjNew)
  const autoPopulateRoundoffData = VoucherRefCal.getRoundOffAddjustmentValues();
  const lineAmountSum = VoucherRefCal.calculateLineAmountSum();
  const billTaxAmount = VoucherRefCal.calculateTaxSum();
  const billItemsPrice = VoucherRefCal.calculateQtySellPriceSum();
  const billDiscountAmount = VoucherRefCal.calculateDiscountSum();
  const billFinalAmount = VoucherRefCal.calculateBillFinalAmount();
  const otherChargesTotal = VoucherRefCal.calculateOtherChargesSum();
  const otherChargesAfterTaxTotal = VoucherRefCal.calculateOtherChargesAfterTaxSum();
  const dueAmount = parseFloat(parseFloat(billFinalAmount) - parseFloat(paidAmount)).toFixed(2);
  const additionalDiscountCurrencyAmount = VoucherRefCal.getAdditionalDiscount();

  const tax = VoucherRefCal.getTaxBreakUp();

  const taxAnalysis = VoucherRefCal.getTaxAnalysis();
  console.log('lineItemsAddedObjNew', lineItemsAddedObjNew);
  dispatch({
    type: HANDLE_ITEM_CALCULATIONS,
    calculatedValue: {
      actionType,
      lineItemsAddedObj,
      lineAmountSum,
      dueAmount,
      tax,
      taxAnalysis,
      billTaxAmount,
      billItemsPrice,
      billFinalAmount,
      otherChargesTotal,
      billDiscountAmount,
      autoPopulateRoundoffData,
      otherChargesAfterTaxTotal,
      additionalDiscountCurrencyAmount
    },
    //TODO: lineItemsAddedObjNew and lineItemsAddedObj are duplicate and need to be removed.
    lineItemsAddedObjNew
  });
};
/**
 * this action is genric for salse and purchase, but has diffrenent api for purchase and salse
 * @param {payload} payload to be sent to server
 */
const onSaveSalesPurchaseVoucher = payload => (dispatch, getState) => {
  const { vouchers: { type } } = getState();
  // const api = type === 'purchase' ? createPurchase(payload) : createSales(payload);
  let api;
  if (type === VOUCHER_TYPE_CHALLAN || type === VOUCHER_TYPE_SCHALLAN) {
    api = createChallan(payload);
  } else if (type === VOUCHER_TYPE_SALES) {
    api = createSales(payload);
  } else if (type === VOUCHER_TYPE_PURCHASE) {
    api = createPurchase(payload);
  }
  dispatch(api)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
      dispatch({ type: SAVED_VOUCHER_SUCCESS });
      dispatch(resetVoucher());
    })
    .catch(error => {
      serverError(error);
    });
};

const setRoundOffValue = value => dispatch => {
  dispatch({
    type: SET_ROUND_OFF_VALUE,
    value
  });
  dispatch(handleItemCalculations('setRoundOffValue', value));
};
const onSaveCreditNote = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  api
    .createCredit(selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
      dispatch({ type: SAVED_VOUCHER_SUCCESS });
    })
    .catch(error => serverError(error));
};

const createRecordPayment = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  return api.createRecordPayment(selectedBranchId, companyId, payload);
};
const onEditCreditNote = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch, _selectedVoucherId }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  api
    .editCreditNote(_selectedVoucherId, selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
      dispatch({ type: SAVED_VOUCHER_SUCCESS });
    })
    .catch(error => serverError(error));
};

const onEditDebitNote = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch, _selectedVoucherId }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  api
    .editDebitNote(_selectedVoucherId, selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
      dispatch({ type: SAVED_VOUCHER_SUCCESS });
    })
    .catch(error => serverError(error));
};

const onSaveDebitNote = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  api
    .createDebit(selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
      dispatch({ type: SAVED_VOUCHER_SUCCESS });
    })
    .catch(error => serverError(error));
};

const lineItemIndex = index => {
  //logic goes here for line itemIndex to populate with current index
  return {
    type: LINE_ITEM_INDEX,
    index
  };
};
const setCreatedItemInLineItems = item => {
  return {
    type: UPDATE_TEMP_ITEM,
    payload: item
  };
};
const toggleViewTaxAnalysis = () => ({
  type: VIEW_TAX_ANALYSIS
});
const fetchVouchers = (companyId, startDate, endDate) => dispatch => {
  dispatch({ type: VOUCHERS_LIST_REQUESTED, payload: {} });

  api
    .fetchVouchers(companyId, startDate, endDate)
    .then(response => {
      let sortedData = sortBy(response, item => item.orderBy);
      dispatch({ type: VOUCHERS_LIST_SUCCESS, payload: sortedData });
    })
    .catch(error => {
      dispatch({ type: VOUCHERS_LIST_FAILED, payload: error });
      // TODO: We can create navigation dispatch action handler like done in
      // react native. For now using directly here for demo purpose
      if (error.response && error.response.status === 401) {
        navigate(dispatch, `/companies/company/${companyId}`);
      } else {
        alert('Error:' + error.message);
      }
    });
};

const getVoucher = voucherId => dispatch => {
  dispatch({ type: GET_VOUCHER_REQUESTED, payload: {} });
  api
    .getVoucher(voucherId)
    .then(response => {
      dispatch({ type: GET_VOUCHER_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: GET_VOUCHER_FAILED, payload: error }));
};

const getShareVoucher = shareId => dispatch => {
  dispatch({ type: GET_VOUCHER_REQUESTED, payload: {} });
  api
    .getShareVoucher(shareId)
    .then(response => {
      dispatch({ type: GET_VOUCHER_SUCCESS, payload: response });
    })
    .catch(error => alert('Access Denied', { type: GET_VOUCHER_FAILED, payload: error }));
};

const increamentVoucherView = (voucherId, shareId) => (dispatch, getState) => {
  dispatch({ type: INCREMENT_VOUCHER_REQUESTED, payload: {} });
  // const companyId = getState().currentCompany.id;
  api
    .increamentVoucherView(voucherId, shareId)
    .then(response => {
      dispatch({ type: INCREMENT_VOUCHER_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: INCREMENT_VOUCHER_FAILED, payload: error }));
};

const generateVoucherPdf = voucherId => dispatch => {
  dispatch({ type: GENERATE_VOUCHER_PDF_REQUESTED, payload: {} });
  api
    .generateVoucherPdf(voucherId)
    .then(response => {
      dispatch({ type: GENERATE_VOUCHER_PDF_SUCCESS, payload: response });
    })
    .catch(error => dispatch({ type: GENERATE_VOUCHER_PDF_FAILED, payload: error }));
};

const createPurchase = (payload, branchId) => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  return api.createPurhcase(selectedBranchId, companyId, payload);
};

const onEditPurchaseVoucher = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch, _selectedVoucherId }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  return api
    .editPurchase(_selectedVoucherId, selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
    })
    .catch(error => {
      serverError(error);
    });
};

const onEditSalesVoucher = payload => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch, _selectedVoucherId }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  return api
    .editSales(_selectedVoucherId, selectedBranchId, companyId, payload)
    .then(res => {
      dispatch(togglePurchaseSalesCreationDrawer());
    })
    .catch(error => {
      serverError(error);
    });
};
const createSales = (payload, branchId) => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    vouchers: { _branches, _selectedBranch }
  } = getState();
  const selectedBranchId = getBranchId(_branches, _selectedBranch);
  return api.createSales(selectedBranchId, companyId, payload);
};

const createChallan = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.createChallan(branchId, companyId, payload);
};

const getVoucherData = voucherId => (dispatch, getState) => {
  const {
    currentCompany: { id: companyId },
    user: { id: userId },
    companies: { branch: { id: branchId } }
  } = getState();
  return api
    .getVoucherData(branchId, companyId, userId, voucherId)
    .then(data => {
      dispatch({ type: FETCH_VOUCHERS_DATA, selectedVoucher: data });
    })
    .catch(error => serverError(error));
};

const handleNoteAddClick = (voucherId, notesPayload) => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api.handleNoteAddClick(companyId, voucherId, notesPayload);
};

const handleRecordPaymentSubmitClick = (voucherId, recordPaymentPayload) => (
  dispatch,
  getState
) => {
  const { currentCompany: { id: companyId } } = getState();
  return api.handleRecordPaymentSubmitClick(companyId, voucherId, recordPaymentPayload);
};

const handleShareVoucherSubmitClick = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.handleShareVoucherSubmitClick(companyId, branchId, payload);
};

const handleAccessToggleClick = (voucherId, contact) => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api.handleAccessToggleClick(companyId, voucherId, contact);
};
const handleVoucherDetaislDone = () => ({
  type: HANDLE_VOUCHER_DETAILS_DONE
});
const onUpdatebranchSearch = input => {
  return {
    type: BRANCH_SEARCH_TEXT,
    input
  };
};
const updateShippingAddress = payload => {
  return {
    type: UPDATE_SHIPPING_ADDRESS,
    payload: payload
  };
};

const createDebitNote = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.createDebit(branchId, companyId, payload);
};

const shareVoucherPost = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.shareVoucherPost(branchId, companyId, payload);
};

const internalNotesPost = (payload, voucherID) => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api.internalNotesPost(companyId, voucherID, payload);
};

const createJournalVoucher = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.createJournal(branchId, companyId, payload);
};

const createPayment = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.createPayment(branchId, companyId, payload).then(res => {
    dispatch({ type: SAVED_VOUCHER_SUCCESS });
    return res;
  });
};

const createReceiptVoucher = payload => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.createReceipt(branchId, companyId, payload).then(res => {
    dispatch({ type: SAVED_VOUCHER_SUCCESS });
    return res;
  });
};

// other charges components value
const toggleOtherCharges = () => {
  return { type: ON_HIDE_OTHER_CHARGES };
};

const addOtherCharges = () => ({
  type: ADD_OTHER_CHARGES_NEW_LINE
});

const deleteCharges = index => dispatch => {
  dispatch({
    type: DELETE_CHRAGES,
    index
  });
  dispatch(handleItemCalculations()); //ref
};

const toggleOtherChargesAfterTax = () => {
  return { type: ON_HIDE_OTHER_CHARGES_AFTER_TAX };
};

const addOtherChargesAfterTax = () => ({
  type: ADD_OTHER_CHARGES_AFTER_TAX_NEW_LINE
});

const deleteOtherChargesAfterTax = index => dispatch => {
  dispatch({
    type: DELETE_OTHER_CHRAGES_AFTER_TAX,
    index
  });
  dispatch(handleItemCalculations()); //ref
};

const updateAccount = (input, index) => (dispatch, getState) => {
  const { vouchers: { accountsName } } = getState();
  const data = accountsName.filter(account => account.name === input).map(data => ({
    refAccountId: data.id,
    name: input,
    accountGroupName: data.accountGroupName,
    description: data.description,
    refPath: data.path,
    creditAmount: 0,
    debitAmount: 0
  }))[0];
  data &&
    dispatch({
      type: UPDATE_ACCOUNT,
      data: { ...data }
    });
};

const updateAmount = (amount, index) => dispatch => {
  dispatch({
    type: UPDATE_AMOUNT,
    amount,
    index
  });
  dispatch(handleItemCalculations());
};

const currentChargeIndexFocus = index => {
  return {
    type: CURRENT_CHARGE_INDEX_FOCUS,
    index: Number(index)
  };
};

const currentOtherChargesAfterTaxIndexFocus = index => {
  return {
    type: CURRENT_OTHER_CHARGES_AFTER_TAX_INDEX_FOCUS,
    index: Number(index)
  };
};

// end

const addNewLineItem = () => (dispatch, getState) => {
  const { vouchers: { app: { lineItem: { lineItemCount } } } } = getState();

  dispatch({
    type: ADD_NEW_LINE_ITEM,
    key: lineItemCount
  });
};
const getSingleVoucher = (voucherId, type) => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api
    .getSingleVoucher(voucherId, companyId)
    .then(response => dispatch({ type: FETCH_VOUCHER_SUCCESSED, response, voucherType: type }))
    .then(error => dispatch({ type: FETCH_VOUCHER_FAILED, error }));
};

const handleDeleteVoucherClick = voucherID => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api.handleDeleteVoucherClick(companyId, voucherID);
};

const handleMoveToChallan = (payload, voucherID) => (dispatch, getState) => {
  const { currentCompany: { id: companyId, primaryBranchId: branchId } } = getState();
  return api.handleMoveToChallan(companyId, branchId, voucherID, payload);
};

const getBranchDataSource = () => (dispatch, getState) => {
  const { currentCompany: { id: companyId } } = getState();
  return api
    .getBranchDataSource(companyId)
    .then(res => {
      dispatch({ type: GET_BRANCH_SUCCESS, payload: res });
    })
    .catch(err => {
      dispatch({ type: GET_BRANCH_FAILED, error: err });
    });
};

export {
  setLastVisitedVoucher,
  toggleViewTaxAnalysis,
  handleVoucherDetaislDone,
  increamentVoucherView,
  createReceiptVoucher,
  generateVoucherPdf,
  setVoucherDetailsOnCreationDrawer,
  setCreditDebitDetailsOnCreationDrawer,
  updateLineItemName,
  toggleAddDiscount,
  hideShippingDetailsLink,
  setCreatedItemInLineItems,
  updateVouchers,
  createChallan,
  resetTransportDetails,
  getShareVoucherData,
  onEditPurchaseVoucher,
  createPayment,
  createSales,
  fetchBranches,
  setDate,
  updateBusinessContact,
  addNewLineItem,
  deleteCharges,
  deleteOtherChargesAfterTax,
  toggleOtherCharges,
  addOtherCharges,
  toggleOtherChargesAfterTax,
  addOtherChargesAfterTax,
  getVoucher,
  getShareVoucher,
  shareVoucherPost,
  updateLineItemNameCrDr,
  internalNotesPost,
  lineItemIndex,
  setShippingAddress,
  togglePurchaseSalesCreationDrawer,
  createJournalVoucher,
  onSaveCreditNote,
  onSaveDebitNote,
  fetchVouchersByNumber,
  updateSelectedVoucher,
  updateAccount,
  updateAmount,
  fetchVouchers,
  showShippingDetails,
  deleteLineItem,
  setVoucherType,
  createPurchase,
  onSaveSalesPurchaseVoucher,
  updateAccountField,
  updateCharges,
  setDiscountUnits,
  setDiscountValue,
  updateLineItemField,
  discountChange,
  updateVouchersDetailsAccount,
  handleItemCalculations,
  createDebitNote,
  onUpdatebranchSearch,
  getSingleVoucher,
  resetVoucher,
  onCloseVoucherPicker,
  currentChargeIndexFocus,
  currentOtherChargesAfterTaxIndexFocus,
  resetShippingDetails,
  resetVoucherDetails,
  updateVoucherTypes,
  setVoucherDurationType,
  handleAccessToggleClick,
  handleRecordPaymentSubmitClick,
  onEditSalesVoucher,
  handleDeleteVoucherClick,
  handleMoveToChallan,
  getVoucherData,
  onEditCreditNote,
  onEditDebitNote,
  updateBusiness,
  setRoundOffValue,
  fetchAllAccounts,
  fetchSalesAccounts,
  fetchReceiptPaymentAccounts,
  closeBusinessContactCard,
  fetchPurchasesAccounts,
  fetchCurrentBalance,
  fetchUnpaidVouchers,
  handleNoteAddClick,
  updateDate,
  createRecordPayment,
  updateShippingAddress,
  handleShareVoucherSubmitClick,
  getBranchDataSource,
  handleTransportDone,
  updateTransportDetails
};
