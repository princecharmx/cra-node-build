import map from 'lodash/map';
import {
  LAST_VISITED_VOUCHER,
  UPDATE_VOUCHERS,
  VOUCHER_DURATION_TYPE,
  UPDATE_VOUCHER_TYPES
} from '../constants';

import {
  ON_CLOSE_VOUCHER_PICKER,
  UPDATE_PARTY_NAME,
  RESET_VOUCHER_LINE_ITEMS,
  FETCH_VOUCHER_SUCCESSED,
  FETCH_UNPAID_VOUCHERS_SUCCESS,
  FETCH_UNPAID_VOUCHERS_FAILURE,
  UPDATE_LINE_ITEM_CRDR,
  RESET_SHIPPING_DETAILS,
  HANDLE_VOUCHER_DETAILS_DONE,
  RESET_TRANSPORT_DETAILS,
  RESET_VOUCHER_DETAILS,
  FETCH_ACCOUNTS_SUCCESS,
  UPDATE_CURRENT_BALANCE,
  VOUCHERS_LIST_REQUESTED,
  UPDATE_SELECTED_VOUCHER,
  FETCH_VOUCHER_BY_NUMBER_SUCCESS,
  ADD_OTHER_CHARGES_NEW_LINE,
  ADD_OTHER_CHARGES_AFTER_TAX_NEW_LINE,
  VOUCHERS_LIST_SUCCESS,
  SAVED_VOUCHER_SUCCESS,
  ON_HIDE_OTHER_CHARGES,
  ON_HIDE_OTHER_CHARGES_AFTER_TAX,
  GET_VOUCHER_REQUESTED,
  GET_VOUCHER_SUCCESS,
  VOUCHER_DATE,
  UPDATE_BUSINESS_CONTACT,
  CLOSE_BUSINESS_CARD,
  UPDATE_VOUCHER_NO,
  UPDATE_DATE,
  TOGGLE_PURCHASE_SALES_DRAWER,
  VIEW_TAX_ANALYSIS,
  HANDLE_TRANSPORT_DONE,
  UPDATE_ALL_BRANCHES,
  UPDATE_SHIPPING_ADDRESS,
  UPDATE_PIN_CODE,
  UPDATE_CITY,
  UPDATE_STATE,
  ADD_NEW_LINE_ITEM,
  SET_CURRENT_ITEM_TO_FOCUS,
  UPDATE_LINE_ITEM,
  UPDATE_TEMP_ITEM,
  ADD_LINE,
  UPDATE_ACCOUNT_FIELD,
  UPDATE_FILTERED_NAMES,
  ACCOUNTS_NAME,
  DRAWER_OPEN_ADD_ACCOUNTS,
  ON_FOCUS_CURRENT_INDEX,
  UPDATE_CHARGES,
  SET_ROUND_OFF_VALUE,
  DELETE_CHRAGES,
  DELETE_OTHER_CHRAGES_AFTER_TAX,
  TOGGLE_ADD_DISCOUNT,
  UPDATE_TRANSPORT_DETAILS,
  SET_DISCOUNT_UNITS,
  SET_DISCOUNT_VALUE,
  RESET_ADD_DISCOUNT,
  TOGGLE_OTHER_CHARGES,
  CURRENT_CHARGE_INDEX_FOCUS,
  UPDATE_ACCOUNT,
  CURRENT_OTHER_CHARGES_AFTER_TAX_INDEX_FOCUS,
  POPULATE_ACCOUNTS_SUGGESTION,
  UPDATE_AMOUNT,
  DELETE_CHARGES,
  UPDATE_LINE_ITEM_FIELD,
  DISCOUNT_CHANGE,
  DELETE_LINE_ITEM,
  UPDATE_VOUCHERS_DETAILS_ACCOUNTS,
  HANDLE_ITEM_CALCULATIONS,
  UPDATE_NARRATION,
  LINE_ITEM_INDEX,
  UPDATE_TAX_BRACKUP,
  SET_SHIPPING_ADDRESS,
  SET_VOUCHER_TYPE,
  BRANCH_SEARCH_TEXT,
  UPDATE_SHIPPING_FOR_SELECTED_VOUCHER,
  TOGGLE_SHIPPING_DETAILS_LINK,
  ON_HIDE_SHOW_LINK,
  POPULATE_ADDTIONAL_DISCOUNT,
  POPULATE_OTHER_CHARGES,
  SET_SELECTED_VOUCHER_ID,
  RESET_LINE_ITEMS_DETAILS,
  FETCH_VOUCHERS_DATA,
  HIDE_SHIPPING_DETAILS
} from '../actions/types';

import omit from 'lodash/omit';
import { objectToArray } from '../utils';

const lastVisitedVoucher = (state = null, payload) => {
  if (payload.type === LAST_VISITED_VOUCHER) {
    return payload.payload;
  }
  return state;
};

const vouchersUpdateState = (state = false, action) => {
  if (action.type === UPDATE_VOUCHERS) {
    return action.payload;
  }
  if (action.type === VOUCHERS_LIST_SUCCESS) {
    return !state;
  }
  return state;
};

const getVoucherDurationType = (state = 'today', payload) => {
  if (payload.type === VOUCHER_DURATION_TYPE) {
    return payload.payload;
  }
  return state;
};

const voucherTypesUpdateState = (state = false, payload) => {
  if (payload.type === UPDATE_VOUCHER_TYPES) {
    return payload.payload;
  }
  return state;
};

//reducer utility function
const updateObject = (state, value) => {
  return {
    ...state,
    ...value
  };
};

const voucherTypeInitialState = {
  openAddAccount: false,
  applyAddtionalDiscount: false,
  discountImg: false,
  party: {},
  type: '',
  _selectedVoucherId: '',
  accountType: '',
  addressCheck: false,
  otherCharges: false,
  currentChargeIndex: 0,
  tempCharges: {},
  otherChargesDataSource: [],
  additionalDiscount: {
    value: 0,
    unit: '%'
  },
  addItemText: true,
  payload: {
    narration: '',
    adjustments: 0,
    otherCharges: 0,
    internalNotes: [],
    dueAmount: '0.00',
    notifyParty: false
  },
  autoPopulateRoundoffData: [],
  voucherItemsSuggestions: [],
  taxBreakup: [],
  totalTax: '0.00',
  currentItemIndex: 0,
  tempChargesAfterTax: {},
  currentAfterTaxIndex: 0,
  otherChargesAfterTax: false,
  otherChargesDataSourceAfterTax: [],
  charges: {
    discount: {
      value: 0,
      isPercent: true
    },
    additional: {}
  },
  charges_after_tax: {},
  verifiedBy: {},
  internalNotes: [],
  businessAccountsSuggestions: [],
  selectedBusinessAccount: null,
  roundoffValue: ''
};

const initialState = {
  type: '',
  savedVouchersSuccess: false,
  loadingVoucherList: false,
  voucherList: null,
  selectedVoucher: {},
  accountsName: [],

  togglePurchaseSalesAddVoucher: false,
  _issueDateObj: new Date(),
  _voucherList: {
    purchase: {},
    sales: {},
    credit: {},
    debit: {}
  },
  _branchSearchText: '',
  _currentBalance: '',
  _unpaidVoucherList: '',
  purchase: voucherTypeInitialState,
  sales: voucherTypeInitialState,
  searchText: null,
  _selectedVocuher: {},
  _selectedBusinessAccount: {},
  _party: {},

  _transport: {
    deliveryNote: '',
    date: '',
    dispatchDocNo: '',
    dispatchThrough: ''
  },
  _otherCharges: {
    0: {
      refAccountId: '',
      name: '',
      accountGroupName: '',
      description: '',
      creditAmount: 0,
      debitAmount: 0,
      amount: 0
    }
  },
  date: null,
  shippingAddress: {
    city: '',
    state: '',
    address: '',
    pincode: '',
    country: 'India'
  },
  _partyName: '',
  _selectedDetailsAccounts: {},
  _shippingAddress: {
    city: '',
    state: '',
    address: '',
    pincode: '',
    country: 'India'
  },
  _searchedVoucherByNo: [],
  _voucherModuleResults: {
    lineAmountSum: 0,
    billTaxAmount: '',
    billFinalAmount: '',
    autoPopulateRoundoffData: [],
    additionalDiscountCurrencyAmount: 0
  },
  _lineItemsAddedObj: {},
  _accountsDetails: [],
  _branches: [],
  _selectedBranch: {},
  _voucherDetailsAccounts: '',
  _otherChargesAfterTax: {
    0: {
      refAccountId: '',
      name: '',
      accountGroupName: '',
      description: '',
      creditAmount: 0,
      debitAmount: 0,
      amount: 0
    }
  },
  _lineItems: {},
  _roundOffValue: '',
  app: {
    toogleBusinessCard: false,
    showTransportCard: false,
    showVoucherDetailsCard: false,
    hideShippingDetails: false,
    showLink: true,
    lineItem: {
      currentItemIndex: 0,
      lineItemCount: 0
    },
    summary: {
      viewTaxAnalysis: false
    },
    otherCharges: {
      onHideAddDiscount: false,
      onHideOtherCharges: false,
      currentChargeIndex: 0,
      currentChargesAfterTaxIndex: 0,
      otherChargesKey: 0,
      otherChargesAfterTaxKey: 0,
      onHideOtherChargesAfterTax: false
    }
  }
};

//state selectores
const getVoucherModuleResultState = state => {
  return state._voucherModuleResults;
};

//functions to update vouchers state

//abstract  functions
// const singleLevelStateUpdate = state => (key1, value1, key2, value2) => ({
//   ...state,
//   [key1]: value1,
//   [key2]: value2
// });
// const secondlevelStateUpdate = state => secondLevelKey => (key, value) => ({
//   ...state,
//   [secondLevelKey]: { ...state[secondLevelKey], [key]: value }
// });

//provide state
// const setFirstLevelWithInitalState = singleLevelStateUpdate(initialState);
// const setSecondLevelWithInitialState = secondlevelStateUpdate(initialState);

// purchase stateUpdate
// const setPurchase = setSecondLevelWithInitialState('purchase');
//

const vouchers = (state = initialState, action) => {
  switch (action.type) {
    case ON_HIDE_OTHER_CHARGES:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            onHideOtherCharges: !state.app.onHideOtherCharges
          }
        }
      };

    case FETCH_VOUCHERS_DATA:
      return {
        ...state,
        _selectedVocuher: action.selectedVoucher
      };
    case ON_HIDE_OTHER_CHARGES_AFTER_TAX:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            onHideOtherChargesAfterTax: !state.app.onHideOtherChargesAfterTax
          }
        }
      };
    case UPDATE_TRANSPORT_DETAILS:
      return {
        ...state,
        _transport: {
          ...state._transport,
          ...action.details
        }
      };
    case HANDLE_TRANSPORT_DONE:
      return {
        ...state,
        app: {
          ...state.app,
          showTransportCard: !state.app.showTransportCard
        }
      };
    case HANDLE_VOUCHER_DETAILS_DONE:
      return {
        ...state,
        app: {
          ...state.app,
          showVoucherDetailsCard: !state.app.showVoucherDetailsCard
        }
      };
    case ADD_OTHER_CHARGES_NEW_LINE:
      return {
        ...state,
        _otherCharges: {
          ...state._otherCharges,
          [state.app.otherCharges.otherChargesKey + 1]: {
            ...state._otherCharges[state.app.otherCharges.otherChargesKey + 1],
            refAccountId: '',
            name: '',
            accountGroupName: '',
            description: '',
            creditAmount: 0,
            debitAmount: 0,
            amount: 0
          }
        },
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            otherChargesKey: state.app.otherCharges.otherChargesKey + 1
          }
        }
      };
    case ADD_OTHER_CHARGES_AFTER_TAX_NEW_LINE:
      return {
        ...state,
        _otherChargesAfterTax: {
          ...state._otherChargesAfterTax,
          [state.app.otherCharges.otherChargesAfterTaxKey + 1]: {
            ...state._otherChargesAfterTax[state.app.otherCharges.otherChargesAfterTaxKey + 1],
            refAccountId: '',
            name: '',
            accountGroupName: '',
            description: '',
            creditAmount: 0,
            debitAmount: 0,
            amount: 0
          }
        },
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            otherChargesAfterTaxKey: state.app.otherCharges.otherChargesAfterTaxKey + 1
          }
        }
      };
    case FETCH_ACCOUNTS_SUCCESS:
      return {
        ...state,
        _accountsDetails: action.response
      };

    case UPDATE_SELECTED_VOUCHER:
      return { ...state, _selectedVocuher: action.input };
    case FETCH_VOUCHER_BY_NUMBER_SUCCESS:
      //if response if already there in voucherList then dont update voucherList
      //TODO: refactor this logic

      const arrayLengthCheck = Boolean(state._searchedVoucherByNo.length);
      const voucherNoArray =
        arrayLengthCheck &&
        state._searchedVoucherByNo.filter(
          voucher => voucher.voucherNo !== action.response.voucherNo
        );
      if (arrayLengthCheck && Boolean(voucherNoArray.length)) {
        return {
          ...state,
          _searchedVoucherByNo: [...state._searchedVoucherByNo, action.response]
        };
      } else if (!arrayLengthCheck) {
        return {
          ...state,
          _searchedVoucherByNo: [...state._searchedVoucherByNo, action.response]
        };
      }
      return state;

    case VOUCHER_DATE:
      return {
        ...state,
        getDate: action.date
      };
    case VOUCHERS_LIST_REQUESTED:
      return {
        ...state,
        loadingVoucherList: true
      };
    case VOUCHERS_LIST_SUCCESS:
      return {
        ...state,
        voucherList: action.payload,
        loadingVoucherList: initialState.loadingVoucherList
      };
    case SAVED_VOUCHER_SUCCESS:
      return {
        ...state,
        savedVouchersSuccess: !state.savedVouchersSuccess
      };
    case SET_VOUCHER_TYPE:
      return {
        ...state,
        type: action.payload
      };
    case ON_CLOSE_VOUCHER_PICKER:
      return {
        ...state,
        _selectedVocuher: {}
      };

    case SET_SELECTED_VOUCHER_ID:
      return {
        ...state,
        _selectedVoucherId: action.id
      };
    case ON_HIDE_SHOW_LINK:
      return {
        ...state,
        app: {
          ...state.app,
          showLink: !state.app.showLink
        }
      };
    case UPDATE_BUSINESS_CONTACT:
      //  let val= ()=>{
      //     setPurchase('selectedBusinessAccount',action.payload.business )
      //     setPurchase('party',action.payload.business )
      //   }
      //     return  val

      return {
        ...state,
        _selectedBusinessAccount: action.payload.business,
        _party: action.payload.party
      };

    case CLOSE_BUSINESS_CARD:
      return {
        ...state,
        _selectedBusinessAccount: {},
        _party: {},
        _currentBalance: '',
        app: {
          ...state.app,
          toogleBusinessCard: !state.app.toogleBusinessCard
        }
      };
    case UPDATE_VOUCHER_NO:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          payload: {
            ...state.purchase.payload,
            voucherNo: action.payload
          }
        }
      };
    case UPDATE_CURRENT_BALANCE:
      return { ...state, _currentBalance: action.response };
    case UPDATE_DATE:
      return {
        ...state,

        _issueDateObj: action.payload.date
      };
    case UPDATE_SHIPPING_FOR_SELECTED_VOUCHER:
      return {
        ...state,
        _shippingAddress: {
          address: action.address.address,
          pincode: action.address.pincode,
          city: action.address.city,
          state: action.address.state
        }
      };
    case TOGGLE_SHIPPING_DETAILS_LINK:
      return {
        ...state,
        app: {
          ...state.app,
          shippingDetailsLink: !state.app.shippingDetailsLink
        }
      };
    case UPDATE_SHIPPING_ADDRESS:
      return {
        ...state,
        _shippingAddress: {
          ...state._shippingAddress,
          address: action.payload
        }
      };
    case UPDATE_PIN_CODE:
      return {
        ...state,
        _shippingAddress: {
          ...state._shippingAddress,
          pincode: action.payload
        }
      };

    case UPDATE_CITY:
      return {
        ...state,
        _shippingAddress: {
          ...state._shippingAddress,
          city: action.payload
        }
      };
    case UPDATE_STATE:
      return {
        ...state,
        _shippingAddress: {
          ...state._shippingAddress,
          state: action.payload // this state is shipping address state not redux state
        }
      };
    case VIEW_TAX_ANALYSIS:
      return {
        ...state,
        app: {
          ...state.app,
          summary: {
            ...state.app.summary,
            viewTaxAnalysis: !state.app.summary.viewTaxAnalysis
          }
        }
      };
    //
    //line Item fields
    case ADD_NEW_LINE_ITEM:
      return {
        ...state,
        //set app state for lineItem key
        app: {
          ...state.app,
          lineItem: {
            ...state.app.lineItem,
            lineItemCount: action.key + 1
          }
        },

        //add new line Items
        _lineItems: {
          ...state._lineItems,
          [action.key + 1]: {
            qtySellPrice: '0',
            hsn: '',
            unit: '',
            qty: 0,
            itemId: '',
            discountUnit: '%',
            itemName: '',
            taxAmount: 0,
            discountAmount: 0,
            itemSkuBarCode: '',
            unitSellPrice: '',
            discountValue: 0,
            taxPercentage: 0,
            lineAmount: '',
            showItemPicker: true
          }
        }
      };
    case UPDATE_LINE_ITEM_FIELD:
      return {
        ...state,
        _lineItems: {
          ...state._lineItems,
          [action.key]: {
            ...state._lineItems[action.key],
            ...action.updatedData
          }
        }
      };
    case DISCOUNT_CHANGE:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          tempItems: {
            ...state.purchase.tempItems,
            [action.payload]: {
              ...state.purchase.tempItems[action.payload],
              discountUnit: !state.purchase.tempItems[action.payload].discountIconChange
                ? 'Rs'
                : '%',
              discountIconChange: !state.purchase.tempItems[action.payload].discountIconChange
            }
          }
        }
      };
    case DELETE_LINE_ITEM:
      return {
        ...state,
        _lineItems: { ...omit(state._lineItems, [action.key]) },
        _lineItemsAddedObj: { ...omit(state._lineItemsAddedObj, [action.key]) },
        app: {
          ...state.app,
          lineItem: {
            ...state.app.lineItem,
            lineItemCount: state.app.lineItem.lineItemCount - 1
          }
        }
      };
    case SET_CURRENT_ITEM_TO_FOCUS:
      return { ...state, currentItemCount: action.currentItemCount };
    case UPDATE_LINE_ITEM:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          voucherItemsSuggestions: action.payload.value,
          tempItems: {
            ...state.purchase.tempItems,
            [action.payload.index]: {
              ...state.purchase.tempItems[action.payload.index],
              itemName: action.payload.input
            }
          }
        }
      };
    case LINE_ITEM_INDEX:
      return {
        ...state,
        app: {
          ...state.app,
          lineItem: { ...state.app.lineItem, currentItemIndex: action.index }
        }
      };
    //TODO: updatetion reducer for lineItems is diffrent for lineItem and lineItemCrDr because of items key value pair name is not same (i.e name, itemName)
    // these reducers will be refactored and a common function to get name will be called to get item name and itemSkuBarCode etc.
    case UPDATE_LINE_ITEM_CRDR:
      const { selectedItems } = action;
      return {
        ...state,

        // update line items
        _lineItems: {
          ...state._lineItems,
          [state.app.lineItem.currentItemIndex]: {
            qtySellPrice: selectedItems.qtySellPrice,
            hsn: selectedItems.hsn ? selectedItems.hsn : '7117',
            unit: selectedItems.unit,
            qty: selectedItems.qty ? selectedItems.qty : 1,
            itemId: selectedItems.id,
            discountUnit: '%',
            itemName: selectedItems.itemName,
            taxAmount: 0,
            discountAmount: 0,
            itemSkuBarCode: selectedItems.itemSkuBarCode,
            unitSellPrice: selectedItems.unitSellPrice,
            discountValue: selectedItems.discountValue || 0,
            taxPercentage: selectedItems.taxPercentage ? selectedItems.taxPercentage : 3,
            showItemPicker: false
          }
        }
      };

    //TODO: updatetion reducer for lineItems is diffrent for lineItem and lineItemCrDr because of items key value pair name is not same (i.e name, itemName)
    // these reducers will be refactored and a common function to get name will be called to get item name and itemSkuBarCode etc.

    //populate lineItem for other edit mode, check if in 'edit' then populate all the line item

    case UPDATE_TEMP_ITEM:
      const { payload } = action;

      //only populate for lineItems comming form voucherList
      if (action.edit) {
        return {
          ...state,
          _lineItems: action.lineItems
        };
      }
      return {
        ...state,
        // update line items
        _lineItems: {
          ...state._lineItems,
          [state.app.lineItem.currentItemIndex]: {
            qtySellPrice: payload.qtySellPrice,
            hsn: payload.hsn ? payload.hsn : '7117',
            unit: payload.unit,
            qty: payload.qty ? payload.qty : 1,
            itemId: payload.id,
            discountUnit: '%',
            itemName: payload.name,
            taxAmount: 0,
            discountAmount: 0,
            itemSkuBarCode: payload.skuBarcode,
            unitSellPrice:
              state.type === 'purchase'
                ? payload.unitPurchasePrice
                : payload.unitSellWholeSalePrice,
            discountValue: payload.discountPercentage || 0,
            unitPurchasePrice: payload.unitPurchasePrice,
            unitSellWholeSalePrice: payload.unitSellWholeSalePrice,
            taxPercentage: payload.taxPercenatge ? payload.taxPercenatge : 3,
            showItemPicker: false
          }
        }
      };

    case FETCH_UNPAID_VOUCHERS_SUCCESS:
      return updateObject(state, { [action.key]: action.response });
    case FETCH_UNPAID_VOUCHERS_FAILURE:
      return updateObject(state, { [action.key]: action.error });

    case ADD_LINE:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            onHideOtherChargesAfterTax: !state.app.otherCharges.onHideOtherChargesAfterTax
          }
        }
      };

    //other charges accounts fields
    case UPDATE_ACCOUNT_FIELD:
      return {
        ...state,
        _otherChargesAfterTax: {
          ...state._otherChargesAfterTax,
          name: action.payload.input
        }
      };

    // return {
    //   ...state,
    //   purchase: {
    //     ...state.purchase,
    //     otherChargesDataSourceAfterTax: action.payload.value,
    //     tempChargesAfterTax: {
    //       ...state.purchase.tempChargesAfterTax,
    //       [action.payload.index]: {
    //         name: action.payload.input
    //       }
    //     }
    //   }
    // };
    case CURRENT_OTHER_CHARGES_AFTER_TAX_INDEX_FOCUS:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            currentChargesAfterTaxIndex: action.index
          }
        }
      };
    //TODO: bookmark fix this yogesh
    case UPDATE_FILTERED_NAMES:
      return {
        ...state,
        _otherChargesAfterTax: {
          ...state._otherChargesAfterTax,
          [state.app.otherCharges.currentChargesAfterTaxIndex]: action.data
        }
      };

    case UPDATE_CHARGES:
      return {
        ...state,
        _otherChargesAfterTax: {
          ...state._otherChargesAfterTax,
          [action.payload.index]: {
            ...state._otherChargesAfterTax[action.payload.index],
            amount: action.payload.amount
          }
        }
      };
    case ACCOUNTS_NAME:
      return {
        ...state,
        accountsName: action.payload
      };
    case DRAWER_OPEN_ADD_ACCOUNTS:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          openAddAccount: true
        }
      };
    case ON_FOCUS_CURRENT_INDEX:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          currentAfterTaxIndex: action.payload
        }
      };
    case SET_ROUND_OFF_VALUE:
      return {
        ...state,
        _roundOffValue: action.value
      };
    case DELETE_CHRAGES:
      return {
        ...state,
        _otherCharges: omit(state._otherCharges, action.index)
      };
    case DELETE_OTHER_CHRAGES_AFTER_TAX:
      return {
        ...state,
        _otherChargesAfterTax: omit(state._otherChargesAfterTax, action.index)
      };
    case HIDE_SHIPPING_DETAILS:
      return {
        ...state,
        app: {
          ...state.app,
          hideShippingDetails: !state.app.hideShippingDetails
        }
      };
    case TOGGLE_ADD_DISCOUNT:
      //TODO: remove it from purchase and bring it to flat level
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            onHideAddDiscount: !state.app.otherCharges.onHideAddDiscount
          }
        }
      };
    case POPULATE_OTHER_CHARGES:
      return {
        ...state,
        _otherCharges: { ...action.otherChragesArray }
      };
    case POPULATE_ADDTIONAL_DISCOUNT:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          additionalDiscount: { ...action.additionalDiscount }
        }
      };
    //Wrong implementation need to fix it
    case SET_DISCOUNT_UNITS:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          discountImg: !state.purchase.discountImg,
          additionalDiscount: {
            ...state.purchase.additionalDiscount,
            unit: state.purchase.discountImg === true ? '%' : 'Rupees'
          }
        }
      };
    case SET_DISCOUNT_VALUE:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          additionalDiscount: {
            ...state.purchase.additionalDiscount,
            value: action.payload
          }
        }
      };
    case RESET_ADD_DISCOUNT:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          applyAddtionalDiscount: false,
          additionalDiscount: {
            ...state.purchase.additionalDiscount,
            value: ''
          }
        }
      };
    case TOGGLE_OTHER_CHARGES:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            onHideOtherCharges: !state.app.otherCharges.onHideOtherCharges
          }
        }
      };
    //   return {
    //     ...state,
    //     purchase: {
    //       ...state.purchase,
    //       otherCharges: false,
    //       tempCharges: {
    //         ...state.purchase.tempCharges,
    //         0: {
    //           refAccountId: '',
    //           name: '',
    //           accountGroupName: '',
    //           description: '',
    //           creditAmount: 0,
    //           debitAmount: 0,
    //           amount: 0
    //         }
    //       }
    //     }
    // };

    //

    case CURRENT_CHARGE_INDEX_FOCUS:
      return {
        ...state,
        app: {
          ...state.app,
          otherCharges: {
            ...state.app.otherCharges,
            currentChargeIndex: action.index
          }
        }
      };
    case UPDATE_ACCOUNT:
      return {
        ...state,
        _otherCharges: {
          ...state._otherCharges,
          [state.app.otherCharges.currentChargeIndex]: action.data
        }
      };

    case POPULATE_ACCOUNTS_SUGGESTION:
      const account = action.payload;
      return {
        ...state,
        purchase: {
          ...state.purchase,
          tempCharges: {
            ...state.purchase.tempCharges,
            [state.purchase.currentChargeIndex]: {
              refAccountId: account.id,
              name: account.name,
              accountGroupName: account.accountGroupName,
              description: account.description,
              creditAmount: 0,
              debitAmount: 0
            }
          }
        }
      };
    case UPDATE_AMOUNT:
      return {
        ...state,
        _otherCharges: {
          ...state._otherCharges,
          [action.index]: {
            ...state._otherCharges[action.index],
            amount: action.amount
          }
        }
      };
    case DELETE_CHARGES:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          tempCharges: omit(state.purchase.tempCharges, action.payload)
        }
      };
    case UPDATE_TAX_BRACKUP:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          taxBreakup: action.payload.taxBreakup,
          totalTax: action.payload.totalTax
        }
      };

    case SET_SHIPPING_ADDRESS:
      return {
        ...state,

        _shippingAddress: {
          ...state._shippingAddress,
          city: state._selectedBusinessAccount.city,
          state: state._selectedBusinessAccount.state,
          address: state._selectedBusinessAccount.address,
          pincode: state._selectedBusinessAccount.pincode
        }
      };
    case UPDATE_NARRATION:
      return {
        ...state,

        _narration: action.payload
      };

    case UPDATE_PARTY_NAME:
      return {
        ...state,
        _partyName: action.input
      };
    case UPDATE_ALL_BRANCHES:
      return {
        ...state,
        _branches: action.response
      };
    case TOGGLE_PURCHASE_SALES_DRAWER:
      return {
        ...state,
        togglePurchaseSalesAddVoucher: !state.togglePurchaseSalesAddVoucher
      };
    case UPDATE_VOUCHERS_DETAILS_ACCOUNTS:
      const selectedAccountData = state._accountsDetails.filter(
        account => action.input === account.name
      );
      const arrayToObj = selectedAccountData.reduce(
        (currVal, preVal) => (currVal[preVal] = preVal),
        {}
      );
      return {
        ...state,
        _voucherDetailsAccounts: action.input,
        _selectedDetailsAccounts: arrayToObj
      };

    case FETCH_VOUCHER_SUCCESSED:
      return {
        ...state,
        _voucherList: {
          ...state._voucherList,
          [action.voucherType]: action.response
        }
      };

    //reset reducers
    case RESET_TRANSPORT_DETAILS:
      return {
        ...state,
        _transport: {
          deliveryNote: '',
          date: '',
          dispatchDocNo: '',
          dispatchThrough: ''
        }
      };
    case RESET_LINE_ITEMS_DETAILS:
      return {
        ...state,
        _lineItems: {}
      };
    case RESET_VOUCHER_DETAILS:
      return {
        ...state,
        purchase: {
          ...state.purchase,
          payload: {
            ...state.purchase.payload,
            voucherNo: ''
          }
        },
        app: {
          ...state.app,
          showVoucherDetailsCard: false
        },

        _branchSearchText: '',
        _issueDateObj: new Date(),
        _voucherDetailsAccounts: ''
      };
    case RESET_SHIPPING_DETAILS:
      return {
        ...state,
        app: {
          ...state.app,
          hideShippingDetails: false
        },
        _shippingAddress: {
          city: '',
          state: '',
          address: '',
          pincode: ''
        }
      };
    case RESET_VOUCHER_LINE_ITEMS:
      return {
        ...state,
        _lineItems: {},
        _voucherModuleResults: {
          lineAmountSum: 0,
          billTaxAmount: '',
          billFinalAmount: '',
          autoPopulateRoundoffData: []
        },
        _otherChargesAfterTax: {
          0: {
            refAccountId: '',
            name: '',
            accountGroupName: '',
            description: '',
            creditAmount: 0,
            debitAmount: 0,
            amount: 0
          }
        },
        otherChargesDataSourceAfterTax: [],
        charges: {
          discount: {
            value: 0,
            isPercent: true
          },
          additional: {}
        }
      };
    //end
    case BRANCH_SEARCH_TEXT:
      return {
        ...state,
        _branchSearchText: action.input,
        _selectedBranch:
          Boolean(state._branches.length) && state._branches.length > 1
            ? state._branches.filter(branch => {
                if (action.input === branch.name) {
                  return branch;
                }
                return null;
              })[0]
            : state._branches[0]
      };
    case HANDLE_ITEM_CALCULATIONS:
      if (action.calculatedValue.actionType === 'delete') {
        return {
          ...state,
          _voucherModuleResults: { ...action.calculatedValue }
        };
      }
      return {
        ...state,
        _lineItems: {
          ...state._lineItems,
          [state.app.lineItem.currentItemIndex]: {
            ...state._lineItems[state.app.lineItem.currentItemIndex],
            ...action.calculatedValue.lineItemsAddedObj
          }
        },
        _voucherModuleResults: { ...action.calculatedValue },
        _lineItemsAddedObj: action.lineItemsAddedObjNew
      };

    default:
      return state;
  }
};

const initialStateGetVocuher = {
  loadingGetVoucher: false,
  voucher: null
};

const selectedVoucher = (state = initialStateGetVocuher, action) => {
  switch (action.type) {
    case GET_VOUCHER_REQUESTED:
      return {
        ...state,
        loadingGetVoucher: true
      };
    case GET_VOUCHER_SUCCESS:
      return {
        ...state,
        voucher: action.payload,
        loadingGetVoucher: initialState.loadingGetVoucher
      };
    default:
      return state;
  }
};

//selectors
const getVoucherDetails = ({
  vouchers: {
    purchase: { payload: { voucherNo } },
    _branchSearchText,
    _issueDateObj,
    _voucherDetailsAccounts
  }
}) => {
  return {
    voucherDetails: {
      voucherNo,
      branch: _branchSearchText,
      date: _issueDateObj,
      accounts: _voucherDetailsAccounts
    }
  };
};
const getShowLink = ({ vouchers: { app: { showLink } } }) => showLink;
const getVoucherType = ({ vouchers: { type } }) => type;
const getParty = ({ vouchers: { _party } }) => _party;
const getIssueDate = ({ vouchers: { _issueDateObj } }) => _issueDateObj;
const getUnpaidVouchersList = ({ vouchers: { _unpaidVoucherList } }) => _unpaidVoucherList;
// this selectors is only Payment and receipt voucher payload genration
const getSelectedAccountDetails = ({ vouchers: { _selectedDetailsAccounts } }) => {
  return {
    refAccountName: _selectedDetailsAccounts.named,
    accountGroupName: _selectedDetailsAccounts.accountGroupName,
    refPath: _selectedDetailsAccounts.path,
    refAccountId: _selectedDetailsAccounts.id
  };
};

const getTransportDetails = ({ vouchers: { _transport } }) => _transport;
const getShowTransportCard = ({ vouchers: { app: { showTransportCard } } }) => showTransportCard;
const getShowCardForVoucherDetails = ({ vouchers: { app: { showVoucherDetailsCard } } }) =>
  showVoucherDetailsCard;

const getVoucherByNumber = ({ vouchers: { _searchedVoucherByNo } }) => {
  const value =
    _searchedVoucherByNo.length > 0 &&
    _searchedVoucherByNo.map(voucher => {
      return {
        voucherNo: voucher.voucherNo,
        partyName: voucher.party.name,
        party: voucher.party,
        lineItem: voucher.itemList
      };
    });
  return value;
};

const getSelectedPurchaseVoucher = ({ vouchers: { _voucherList: { purchase } } }) => purchase;
const getSelectedSalesVoucher = ({ vouchers: { _voucherList: { sales } } }) => sales;
const getSelectedVoucherDetails = ({ vouchers: { _selectedVocuher } }) => _selectedVocuher;
const getStartDate = ({ vouchers: { getDate: { startDate } } }) => startDate;
const getselectedBusinessAccount = ({ _selectedBusinessAccount }) => _selectedBusinessAccount; //TODO: hook it properly for selected vouchers
const getShippingAddress = ({ _shippingAddress }) => _shippingAddress;
const getCurrentBalance = ({ _currentBalance: { currentBalance } }) => currentBalance;
const getToogleBusinessCard = ({ app: { toogleBusinessCard } }) => toogleBusinessCard;
const getSearchText = vouchers => {
  const { _partyName } = vouchers;
  return _partyName;
};
const getopenAddDrawer = ({ vouchers: { togglePurchaseSalesAddVoucher } }) =>
  togglePurchaseSalesAddVoucher;
const getNarrationValue = ({ vouchers: { _narration } }) => _narration;
const getSummaryBlockData = ({
  vouchers: { roundoffValue, _voucherModuleResults: { billFinalAmount, billTaxAmount } }
}) => ({
  roundoffValue,
  billFinalAmount,
  billTaxAmount
});
const getbusinessAccountsSuggestions = ({ businessAccountsData }) => businessAccountsData;
const getAccountsName = vouchers => {
  let accountNameArray = vouchers
    ? map(vouchers.accountsName, accountInfo => accountInfo.name)
    : [];
  return accountNameArray;
};
const getTotalQty = ({ vouchers: { _lineItems } }) => {
  const add = (a, b) => a + b;
  const qtyArray = map(_lineItems, items => parseFloat(items.qty));
  const qty = Boolean(qtyArray.length) && qtyArray.reduce(add);
  return qty;
};
const getlineAmountSum = ({ vouchers: { _voucherModuleResults: { lineAmountSum = 0 } } }) =>
  lineAmountSum;
const getRoundOffValues = values => values;

const getOtherChargesAfterTax = otherCharges => otherCharges;
const getTaxAnalysisData = taxAnalysis => {
  return taxAnalysis.map(item => ({
    sNo: item.index,
    name: item.itemName,
    price: item.itemPrice,
    tax: item.itemTaxAmount,
    totalPrice: item.totalPriceWeightage,
    totalTax: item.totalTaxWeightage,
    otherChargesTaxBreakup: item.otherChargesTaxBreakup.map(otherCharges => {
      return {
        accountName: otherCharges.accountName,
        price: otherCharges.priceWeightage,
        tax: otherCharges.taxWeightage,
        formulaToDisplay: otherCharges.formulaToDisplay
      };
    })
  }));
};
const getotherChargesTaxBreakup = taxAnalysis => {
  return taxAnalysis.map(taxItem => taxItem.otherChargesTaxBreakup);
};
const getTempItems = ({ vouchers: { type, _lineItems, _selectedVocuher: { lineItem } } }) => {
  // if (type === 'credit_note' || type === 'debit_note') {
  //   return map(lineItem, item => ({
  //     hsn: item.hsn,
  //     qty: item.qty,
  //     unit: item.unit,
  //     itemName: item.itemName,
  //     taxPercentage: item.taxPercentage,
  //     unitSellPrice: item.unitSellPrice,
  //     showItemPicker: true,
  //     itemSkuBarCode: item.itemSkuBarCode,
  //     discountIconChange: item.discountIconChange,
  //     discountValue: item.discountValue,
  //     lineAmount: item.lineAmount
  //   }));
  // }
  return map(_lineItems, item => ({
    hsn: item.hsn,
    qty: item.qty,
    unit: item.unit,
    itemName: item.itemName,
    taxPercentage: item.taxPercentage,
    unitSellPrice: item.unitSellPrice,
    showItemPicker: item.showItemPicker,
    itemSkuBarCode: item.itemSkuBarCode,
    discountIconChange: item.discountIconChange,
    discountValue: item.discountValue,
    lineAmount: item.lineAmount
  }));
};

//selectors for payload genration
const genratePurchaseSalesPayload = (vouchers, companies) => {
  const { branch = [] } = companies;
  //WARNINGS: FIX  this once branch field is hooked
  const branchId = branch.length > 0 ? branch[0].id : [{ name: 'andheri', id: '122344' }];

  const adjustments = vouchers._voucherModuleResults.autoPopulateRoundoffData.filter(
    item => item.outputValue === vouchers._roundOffValue
  );
  // const otherChargesAfterTax =
  //   vouchers._otherChargesAfterTax.refAccountId === '' &&
  //   vouchers._otherChargesAfterTax.name === '' &&
  //   vouchers._otherChargesAfterTax.amount === 0
  //     ? []
  //     : [{ ...vouchers._otherChargesAfterTax }];
  return {
    ...vouchers.purchase.payload,
    voucherNo: vouchers._voucherList.purchase.voucherNo,
    iBranchId: branchId,
    party: {
      ...vouchers._party
    },
    refAccountId: vouchers._selectedDetailsAccounts.id,
    refAccountName: vouchers._selectedDetailsAccounts.name,
    refAccountGroup: vouchers._selectedDetailsAccounts.accountGroupName,
    refPath: vouchers._selectedDetailsAccounts.path,
    itemList: map(vouchers._lineItems, (lineItem, i) => {
      if (Object.keys(vouchers._lineItemsAddedObj).length > 0 && vouchers._lineItemsAddedObj[i]) {
        return {
          ...lineItem,
          discountAmount: vouchers._lineItemsAddedObj[i].discountAmount,
          lineAmount: vouchers._lineItemsAddedObj[i].lineAmount,
          qtySellPrice: vouchers._lineItemsAddedObj[i].qtySellPrice,
          taxAmount: vouchers._lineItemsAddedObj[i].taxAmount
        };
      }
    }),
    shippingAddress: { ...vouchers._shippingAddress },
    otherCharges: objectToArray(vouchers._otherCharges),
    otherChargesAfterTax:
      vouchers._otherChargesAfterTax[0].refAccountId === ''
        ? []
        : map(vouchers._otherChargesAfterTax, otherCharges => otherCharges),
    // vouchers._otherChargesAfterTax[0].refAccountId !== ''
    //   ? objectToArray(vouchers._otherChargesAfterTax)
    //   : [],
    internalNotes: [],
    issueDate: vouchers._issueDateObj,
    tax: getVoucherModuleResultState(vouchers).tax,
    dueAmount: getVoucherModuleResultState(vouchers).dueAmount,
    narration: vouchers.purchase.payload.narration,
    billItemsPrice: getVoucherModuleResultState(vouchers).billItemsPrice,
    billDiscountAmount: getVoucherModuleResultState(vouchers).billDiscountAmount,
    additionalDiscount: vouchers.purchase.additionalDiscount,
    otherChargesTotal: getVoucherModuleResultState(vouchers).otherChargesTotal,
    billAmountBeforeTax: getVoucherModuleResultState(vouchers).lineAmountSum,
    billTaxAmount: getVoucherModuleResultState(vouchers).billTaxAmount,
    adjustments:
      adjustments.length === 0
        ? 0
        : vouchers._roundOffValue !== '' &&
          getVoucherModuleResultState(vouchers).autoPopulateRoundoffData.find(
            data => data.outputValue === vouchers._roundOffValue
          ).offset,
    lockOnRead: true,
    lockOnUpdate: true,
    billFinalAmount: getVoucherModuleResultState(vouchers).billFinalAmount
  };
};

const genrateCreditDebit = state => {
  const { vouchers, vouchers: { _issueDateObj, _searchedVoucherByNo } } = state;
  const adjustments = vouchers._voucherModuleResults.autoPopulateRoundoffData.filter(
    item => item.outputValue === vouchers._roundOffValue
  );
  if (_searchedVoucherByNo[0]) {
    return {
      voucherNo: '',
      refAccountId: vouchers._selectedDetailsAccounts.id,
      issueDate: _issueDateObj,
      narration: '',
      notifyParty: false,
      readLockEnabled: true,
      updateLockEnabled: true,
      internalNotes: [],
      party: _searchedVoucherByNo[0].party,
      itemList: map(vouchers._lineItems, (lineItem, i) => {
        if (Object.keys(vouchers._lineItemsAddedObj).length > 0) {
          return {
            ...lineItem,
            discountAmount: vouchers._lineItemsAddedObj[i].discountAmount,
            lineAmount: vouchers._lineItemsAddedObj[i].lineAmount,
            qtySellPrice: vouchers._lineItemsAddedObj[i].qtySellPrice,
            taxAmount: vouchers._lineItemsAddedObj[i].taxAmount
          };
        }
      }),
      verifiedBy: [],
      voucherRefNo: _searchedVoucherByNo[0].voucherNo,
      billItemsPrice: getVoucherModuleResultState(vouchers).billItemsPrice,
      billDiscountAmount: getVoucherModuleResultState(vouchers).billDiscountAmount,
      billTaxAmount: getVoucherModuleResultState(vouchers).billTaxAmount,
      billFinalAmount: getVoucherModuleResultState(vouchers).billFinalAmount,
      dueAmount: getVoucherModuleResultState(vouchers).dueAmount,
      adjustments:
        adjustments.length === 0
          ? 0
          : vouchers._roundOffValue !== '' &&
            getVoucherModuleResultState(vouchers).autoPopulateRoundoffData.find(
              data => data.outputValue === vouchers._roundOffValue
            ).offset,
      tax: getVoucherModuleResultState(vouchers).tax
    };
  }
};
const getbranchNamesArray = ({ vouchers: { _branches } }) => _branches.map(branch => branch.name);
const getHideShippingDetails = ({ vouchers: { app: { hideShippingDetails } } }) =>
  hideShippingDetails;
const getAccountsDetails = ({ vouchers: { _accountsDetails } }) => {
  return _accountsDetails.map(account => account.name);
};
const getVoucherDetailsAccounts = ({ vouchers: { _voucherDetailsAccounts } }) =>
  _voucherDetailsAccounts;
const getBranchSearchText = ({ _branchSearchText }) => _branchSearchText;
const getSavedVouchersSuccess = ({ vouchers: { savedVouchersSuccess } }) => savedVouchersSuccess;
export {
  lastVisitedVoucher,
  vouchersUpdateState,
  getAccountsName,
  getHideShippingDetails,
  getShowLink,
  getUnpaidVouchersList,
  genrateCreditDebit,
  getVoucherDetails,
  getSavedVouchersSuccess,
  getVoucherDetailsAccounts,
  getSelectedVoucherDetails,
  getVoucherDurationType,
  voucherTypesUpdateState,
  getBranchSearchText,
  getbranchNamesArray,
  selectedVoucher,
  getShowCardForVoucherDetails,
  getselectedBusinessAccount,
  getSearchText,
  getSummaryBlockData,
  getShippingAddress,
  getShowTransportCard,
  getTempItems,
  getVoucherType,
  vouchers,
  getParty,
  getIssueDate,
  getStartDate,
  getSelectedAccountDetails,
  getAccountsDetails,
  getVoucherByNumber,
  getNarrationValue,
  getCurrentBalance,
  getTotalQty,
  getSelectedPurchaseVoucher,
  getSelectedSalesVoucher,
  getRoundOffValues,
  getTransportDetails,
  getToogleBusinessCard,
  getlineAmountSum,
  getTaxAnalysisData,
  getOtherChargesAfterTax,
  genratePurchaseSalesPayload,
  getopenAddDrawer,
  getotherChargesTaxBreakup,
  getbusinessAccountsSuggestions
};
