/* eslint-disable */
import cookie from 'react-cookies';
import map from 'lodash/map';
import filter from 'lodash/filter';
import moment from 'moment';

export const errorObj = (error, alertbox = false) => {
  alertbox
    ? console.log('error:', error)
    : alert(
        error.response && error.response.data && error.response.data !== null
          ? error.response.data.error.message
          : 'Something went wrong, please try again!'
      );
};

export function objectToArray(object) {
  return map(object, item => item);
}

export function getBranchId(allBranches, selectedBranches) {
  const branchId = allBranches.length === 1 ? allBranches[0].id : selectedBranches.id;
  return branchId;
}

export function getFilteredData(data, property, query) {
  if (!query) {
    return data;
  }

  if (property === 'party') {
    return filter(data, item => {
      if (
        item[property] &&
        item[property]['name']
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      ) {
        return item;
      }
    });
  } else {
    return filter(data, item => {
      if (
        item[property] &&
        item[property]
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) > -1
      ) {
        return item;
      }
    });
  }
}

export function arrayToObject(array) {
  const obj = {};
  map(array, (item, index) => (obj[index] = item));
  return obj;
}

export const formatDate = date =>
  JSON.stringify(date)
    .replace('"', '')
    .replace('"', '');

export const getFormattedDate = date => {
  return moment(date).format('DD/MM/YY');
};

export const getStartOfFinancialYear = refDate => {
  const START_FINANCIAL_APRIL_MONTH = 3;
  const START_DAY = 1;
  let month = moment(refDate).get('month');
  let year = moment(refDate).get('year');
  if (month <= START_FINANCIAL_APRIL_MONTH) {
    year = year - 1;
  }
  const startDate = moment()
    .date(START_DAY)
    .month(START_FINANCIAL_APRIL_MONTH)
    .year(year);
  return getStartTimeOfDay(startDate);
};

export const getEndOfFinancialYear = refDate => {
  const END_FINANCIAL_MARCH_MONTH = 2;
  const END_DAY = 31;
  let month = moment(refDate).get('month');
  let year = moment(refDate).get('year');
  if (month >= END_FINANCIAL_MARCH_MONTH) {
    year = year + 1;
  }
  const endDate = moment()
    .date(END_DAY)
    .month(END_FINANCIAL_MARCH_MONTH)
    .year(year);
  return getEndTimeOfDay(endDate);
};

const getStartTimeOfDay = date => {
  return moment(date).startOf('day');
};

const getEndTimeOfDay = date => {
  return moment(date).endOf('day');
};

export function removeLocalStorage() {
  localStorage.clear();
  var cookies = cookie.loadAll();
  for (var k in cookies) {
    if (cookies.hasOwnProperty(k)) {
      cookie.remove(k, { path: '/' });
    }
  }
  setTimeout(() => {
    window.location.reload();
  }, 200);
}
