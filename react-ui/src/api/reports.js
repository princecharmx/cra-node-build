import { companyAuthFetch, extractData } from './server';
// import * as CONSTANTS from '../constants';

export const getTrialBalance = (companyId, startDate, endDate) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyId}/reports/trial-balance?startTime=${startDate}&endTime=${endDate}`
    )
    .then(extractData);

export const getAccountByPath = (companyId, path, startDate, endDate) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyId}/reports/account-group/path?path=${path}&startTime=${startDate}&endTime=${endDate}`
    )
    .then(extractData);

export const getLedgerWiseReport = (companyId, startDate, endDate) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/reports/ledger-wise?startTime=${startDate}&endTime=${endDate}`)
    .then(extractData);

export const getYearlyWiseReport = (companyId, accountId, startDate, endDate) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyId}/reports/accounts/${accountId}/year-Breakup?startTime=${startDate}&endTime=${endDate}`
    )
    .then(extractData);

export const getMonthlyWiseReport = (companyId, accountId, startDate, endDate) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyId}/reports/accounts/${accountId}/date-wise?startTime=${startDate}&endTime=${endDate}`
    )
    .then(extractData);
