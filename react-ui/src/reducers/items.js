import { ITEMS_DATA, TEMP_ITEM_DATA } from '../constants';
import {
  TOGGLE_ADD_ITEMS,
  SET_ITEM_GROUP,
  SHOW_ITEM_GROUP_DIALOG,
  UPDATE_SELECTED_ITEM_GROUP,
  RESET_SELECTED_ITEM_GROUP,
  SET_ALL_ITEM_GROUP,
  SET_ITEM_PAYLOAD,
  SHOW_ITEM_SALES_PRICE,
  CANCEL_ITEM_SALES_PRICE,
  RESET_ITEM_PAYLOAD,
  SET_ITEM_GROUP_SEARCH_TEXT,
  SHOW_SALES_PRICE_VALUE,
  SET_ITEM_ERROR,
  SET_ITEM_DATA
} from '../actions/types';

const initialState = {
  items: [],
  payload: {
    itemGroupId: '',
    name: '',
    collectionType: '',
    baseMaterial: '',
    color: '',
    unit: '',
    skuBarcode: '',
    iBranchId: '',
    unitPurchasePrice: 0,
    unitSellWholeSalePrice: 0,
    unitSellRetailPrice: 0,
    exclusiveOfTax: true,
    wholesaleMarkupBase: 'unitPurchasePrice',
    wholesaleMarkup: 0,
    retailMarkupBase: 'unitPurchasePrice',
    retailMarkup: 0,
    storageLocation: '',
    warehouseLocation: '',
    description: ''
  },
  itemGroups: [],
  _itemGroupSearchText: '',
  _selectedItemGroup: {
    id: '',
    name: '',
    code: '',
    hsn: '',
    taxPercentage: '',
    description: ''
  },
  itemError: {},
  app: {
    onShowAddItems: false,
    onShowItemGroup: false,
    showItemSalesPrice: false,
    showSalesPriceValue: false
  }
};
const items = (state = initialState, action) => {
  // if (payload.type === ITEMS_DATA) {
  //   return payload.payload;
  // }
  // return state;
  switch (action.type) {
    case ITEMS_DATA:
      return { ...state, items: action.payload };
    case TOGGLE_ADD_ITEMS:
      return {
        ...state,

        app: {
          ...state.app,
          onShowAddItems: !state.app.onShowAddItems
        }
      };
    case SET_ITEM_GROUP:
      return {
        ...state,
        _selectedItemGroup: {
          ...action.payload._selectedItemGroup
        }
      };
    case SHOW_ITEM_GROUP_DIALOG:
      return {
        ...state,
        _selectedItemGroup: {
          ...initialState._selectedItemGroup,
          name: state._itemGroupSearchText
        },
        app: {
          ...state.app,
          onShowItemGroup: !state.app.onShowItemGroup
        }
      };
    case UPDATE_SELECTED_ITEM_GROUP:
      return {
        ...state,
        _selectedItemGroup: {
          ...state._selectedItemGroup,
          ...action.details
        }
      };
    case RESET_SELECTED_ITEM_GROUP:
      return {
        ...state,
        _selectedItemGroup: {
          ...initialState._selectedItemGroup
        }
      };
    case SET_ALL_ITEM_GROUP:
      return {
        ...state,
        itemGroups: action.payload
      };
    case SET_ITEM_PAYLOAD:
      return {
        ...state,
        payload: {
          ...state.payload,
          ...action.details
        }
      };
    case SHOW_ITEM_SALES_PRICE:
      return {
        ...state,
        app: {
          ...state.app,
          showItemSalesPrice: !state.app.showItemSalesPrice
        }
      };
    case CANCEL_ITEM_SALES_PRICE:
      return {
        ...state,
        payload: {
          ...state.payload,
          unitSellWholeSalePrice: 0,
          unitSellRetailPrice: 0,
          wholesaleMarkup: 0,
          retailMarkup: 0
        },
        app: {
          ...state.app,
          showSalesPriceValue: false
        }
      };
    case RESET_ITEM_PAYLOAD:
      return {
        ...state,
        payload: {
          ...initialState.payload
        },
        _selectedItemGroup: {
          ...initialState._selectedItemGroup
        }
      };
    case SET_ITEM_GROUP_SEARCH_TEXT:
      return {
        ...state,
        _itemGroupSearchText: action.searchText
      };
    case SHOW_SALES_PRICE_VALUE:
      return {
        ...state,
        app: {
          ...state.app,
          showSalesPriceValue: !state.app.showSalesPriceValue
        }
      };
    case SET_ITEM_DATA:
      return {
        ...state,
        items: [...state.items, action.item]
      };
    case SET_ITEM_ERROR:
      return {
        ...state,
        itemError: {
          ...state.itemError,
          ...action.details
        }
      };
    default:
      return state;
  }
};

const getAllBranches = ({ companies: { branch } }) => branch;
const getShowSalesPriceValue = ({ items: { app: { showSalesPriceValue } } }) => showSalesPriceValue;
const getItemGroupSearchText = ({ items: { _itemGroupSearchText } }) => _itemGroupSearchText;
const getSelectedItemGroup = ({ items: { _selectedItemGroup } }) => _selectedItemGroup;
const getShowItemGroup = ({ items: { app: { onShowItemGroup } } }) => onShowItemGroup;
const getShowItemSalesPrice = ({ items: { app: { showItemSalesPrice } } }) => showItemSalesPrice;
const getAllItemGroups = ({ items: { itemGroups } }) => itemGroups;
const getItemPayloadDetails = ({ items: { payload: itemPayload } }) => itemPayload;
const getItemError = ({ items: { itemError } }) => itemError;
const getTempItemData = (state = null, payload) => {
  if (payload.type === TEMP_ITEM_DATA) {
    return payload.payload;
  }
  return state;
};

//selectors
const getItemsNames = ({
  vouchers: { type },
  vouchers: { _selectedVocuher: { lineItem } },
  items: { items }
}) => {
  if (type === 'credit_note' || type === 'debit_note') {
    return lineItem && lineItem.map(item => item.itemName);
  }
  return items.map(item => item.name);
};

const getItems = ({ items: { items } }) => items;
const getOnShowAddItems = ({ items: { app: { onShowAddItems } } }) => onShowAddItems;
export {
  items,
  getTempItemData,
  getItemsNames,
  getItems,
  getOnShowAddItems,
  getShowItemGroup,
  getSelectedItemGroup,
  getAllItemGroups,
  getItemPayloadDetails,
  getShowItemSalesPrice,
  getItemGroupSearchText,
  getShowSalesPriceValue,
  getAllBranches,
  getItemError
};
