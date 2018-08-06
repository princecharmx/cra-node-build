import { ITEMS_DATA, TEMP_ITEM_DATA } from '../constants';

import {
  COMPANY_ITEMS_REQUESTED,
  COMPANY_ITEMS_SUCCESS,
  SHOW_ITEM_GROUP_DIALOG,
  COMPANY_ITEMS_FAILED,
  TOGGLE_ADD_ITEMS,
  SET_ITEM_GROUP,
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
} from './types';
import _ from 'lodash';

import * as api from '../api/companies';

export const storeItems = payload => {
  return {
    type: ITEMS_DATA,
    payload: payload
  };
};

export const storeTempItemData = payload => {
  return {
    type: TEMP_ITEM_DATA,
    payload: payload
  };
};

export const fetchCompanyItems = () => (dispatch, getState) => {
  const { currentCompany } = getState();
  dispatch({ type: COMPANY_ITEMS_REQUESTED, payload: {} });

  api
    .fetchCompanyItems(currentCompany.id)
    .then(response => {
      dispatch({ type: COMPANY_ITEMS_SUCCESS, payload: response });
      dispatch({ type: ITEMS_DATA, payload: response });
    })
    .catch(error => dispatch({ type: COMPANY_ITEMS_FAILED, payload: error }));
};

export const createItemGroup = payload => (dispatch, getState) => {
  const { currentCompany: { id: iCompanyId }, items: { _selectedItemGroup } } = getState();
  delete payload.id;
  delete _selectedItemGroup.id;
  return api.createItemGroup(iCompanyId, _selectedItemGroup).then(response => {
    dispatch({
      type: SHOW_ITEM_GROUP_DIALOG
    });
    dispatch({
      type: SET_ITEM_GROUP,
      payload: { _selectedItemGroup: response }
    });
    dispatch({
      type: SET_ITEM_PAYLOAD,
      details: {
        itemGroupId: response.id
      }
    });
    //itemGroups.push(response);
    //[...itemGroups, ...response]
    // dispatch({
    //   type: SET_ALL_ITEM_GROUP,
    //   payload: [...itemGroups, response]
    // });
    dispatch({
      type: SET_ITEM_GROUP_SEARCH_TEXT,
      searchText: response.name
    });
    return;
  });
};
export const getItemGroup = () => (dispatch, getState) => {
  const { currentCompany: { id: iCompanyId } } = getState();
  return api.getItemGroup(iCompanyId).then(response => {
    dispatch({
      type: SET_ALL_ITEM_GROUP,
      payload: response
    });
    return;
  });
};
export const createItem = () => (dispatch, getState) => {
  const {
    currentCompany: { id: iCompanyId, primaryBranchId: branchId },
    items: { payload }
  } = getState();
  payload.iBranchId = branchId;
  api
    .createItem(iCompanyId, payload)
    .then(success => {
      dispatch({
        type: TOGGLE_ADD_ITEMS
      });
      dispatch({
        type: RESET_ITEM_PAYLOAD
      });
      dispatch({
        type: CANCEL_ITEM_SALES_PRICE
      });
      dispatch({
        type: SET_ITEM_DATA,
        item: success
      });
      return success;
    })
    .catch(err => {
      _.forIn(err.response.data.error.details.messages, (value, key) => {
        dispatch({
          type: SET_ITEM_ERROR,
          details: {
            [key]: value[0]
          }
        });
      });
      return err;
    });
};

export const setItemErrorAction = (field, value) => {
  return {
    type: SET_ITEM_ERROR,
    details: {
      [field]: value
    }
  };
};
// const fetchColors = () => (dispatch, getState) => {
//   const { currentCompany } = getState();

//   api
//     .fetchColors(currentCompany.id)
//     .then(response => {
//       dispatch({ type: FETCH_COLORS_SUCCESS, payload: response });
//     })
//     .catch(error => dispatch({ type: FETCH_COLORS_FAILED, payload: error }));
// };

export const setItemGroup = payload => {
  return {
    type: SET_ITEM_GROUP,
    payload: payload
  };
};
export const showItemGroupDialog = () => {
  return {
    type: SHOW_ITEM_GROUP_DIALOG
  };
};

export const toggleAddItems = () => {
  return {
    type: TOGGLE_ADD_ITEMS
  };
};

export const updateSelectedItemGroup = (field, value) => {
  return {
    type: UPDATE_SELECTED_ITEM_GROUP,
    details: {
      [field]: value
    }
  };
};

export const resetSelectedItemGroup = () => {
  return {
    type: RESET_SELECTED_ITEM_GROUP
  };
};

export const setItemPayload = (field, value) => {
  return {
    type: SET_ITEM_PAYLOAD,
    details: {
      [field]: value
    }
  };
};

export const setItemGroupSearchText = input => {
  return {
    type: SET_ITEM_GROUP_SEARCH_TEXT,
    searchText: input
  };
};

export const showItemSalesPrice = () => {
  return {
    type: SHOW_ITEM_SALES_PRICE
  };
};

export const cancelItemSalesPrice = () => {
  return {
    type: CANCEL_ITEM_SALES_PRICE
  };
};

export const resetItemPayload = () => {
  return {
    type: RESET_ITEM_PAYLOAD
  };
};

export const setShowSalesPriceValue = () => {
  return {
    type: SHOW_SALES_PRICE_VALUE
  };
};
