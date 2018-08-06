import { companyAuthFetch, extractData, companyBranchFetch, fetch } from './server';
import * as CONSTANTS from '../constants';
const createVouhcer = (branchId, companyId, payload, type) =>
  companyBranchFetch
    .post(`/i-companies/${companyId}/i-branches/${branchId}/vouchers/${type}`, payload)
    .then(extractData);

const editVoucher = (vouchersId, branchId, companyId, payload, type) =>
  companyBranchFetch
    .put(`/i-companies/${companyId}/i-branches/${branchId}/vouchers/${vouchersId}/${type}`, payload)
    .then(extractData);

export const fetchShareVoucherData = (companyId, refId, selectedVocherId) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/vouchers/${selectedVocherId}/share?businessId=${refId}`)
    .then(extractData);
export const fetchVoucher = (id, searchString) =>
  companyAuthFetch
    .get(`/i-companies/${id}/vouchers/search?searchString=${searchString}`)
    .then(extractData);

export const fetchBranch = companyId =>
  companyAuthFetch.get(`i-companies/${companyId}/i-branches`).then(extractData);
export const shareVoucherPost = (branchId, companyId, payload) =>
  companyAuthFetch.post(`/i-companies/${companyId}/i-branches/${branchId}/vouchers/share`, payload);

export const internalNotesPost = (companyId, voucherID, payload) =>
  companyAuthFetch.post(`/i-companies/${companyId}/vouchers/${voucherID}/internal-note`, payload);

export const fetchVouchers = (companyId, startDate, endDate) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/vouchers/types?startDate=${startDate}&endDate=${endDate}`)
    .then(extractData);

export const getVoucher = voucherId =>
  companyAuthFetch.get(`vouchers/${voucherId}`).then(extractData);

export const getShareVoucher = shareId =>
  fetch.get(`share-statuses/voucher/share-status/${shareId}`).then(extractData);

export const generateVoucherPdf = voucherId =>
  companyAuthFetch.get(`vouchers/${voucherId}/pdf/download`).then(extractData);

export const increamentVoucherView = (voucherId, shareId) =>
  companyAuthFetch.put(`/vouchers/${voucherId}/share/${shareId}/increment-count`).then(extractData);

export const getVoucherData = (branchId, companyId, userId, voucherId) =>
  companyAuthFetch.get(`/i-companies/${companyId}/vouchers/${voucherId}`).then(extractData);

export const getShareVoucherData = (companyId, branchId, voucherId, businessId) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/vouchers/${voucherId}/share?businessId=${businessId}`)
    .then(extractData);

export const handleNoteAddClick = (companyId, voucherId, notesPayload) =>
  companyAuthFetch
    .post(`/i-companies/${companyId}/vouchers/${voucherId}/internal-note`, notesPayload)
    .then(extractData);

export const handleRecordPaymentSubmitClick = (companyId, voucherId, recordPaymentPayload) =>
  companyAuthFetch
    .post(`/i-companies/${companyId}/voucher/${voucherId}/record-payment`, recordPaymentPayload)
    .then(extractData);

export const handleAccessToggleClick = (companyId, voucherId, contact) =>
  companyAuthFetch
    .put(`/i-companies/${companyId}/vouchers/${voucherId}/status/${contact.id}/access`, {
      accessEnabled: !contact.accessEnabled
    })
    .then(extractData);

export const handleShareVoucherSubmitClick = (companyId, branchId, payload) =>
  companyAuthFetch
    .post(`/i-companies/${companyId}/i-branches/${branchId}/vouchers/share`, payload)
    .then(extractData);

export const handleDeleteVoucherClick = (companyId, voucherID) =>
  companyAuthFetch.delete(`/i-companies/${companyId}/vouchers/${voucherID}`);

export const handleMoveToChallan = (companyId, branchId, voucherID, payload) =>
  companyAuthFetch.put(
    `/i-companies/${companyId}/i-branches/${branchId}/vouchers/${voucherID}/challan`,
    payload
  );

//voucher creation apis
export const createSales = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_SALES);

export const createDebit = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_DEBIT_NOTE);

export const createCredit = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_CREDIT_NOTE);

export const editCreditNote = (voucherID, branchId, companyId, payload) =>
  editVoucher(voucherID, branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_CREDIT_NOTE);

export const editDebitNote = (voucherID, branchId, companyId, payload) =>
  editVoucher(voucherID, branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_CREDIT_NOTE);

export const createReceipt = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_RECEIPT);

export const createPayment = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_PAYMENT);

export const createChallan = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, 'schallan');

export const createJournal = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_JOURNAL);

export const createPurhcase = (branchId, companyId, payload) =>
  createVouhcer(branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_PURCHASE);

// purchase edit
export const editPurchase = (voucherID, branchId, companyId, payload) =>
  editVoucher(voucherID, branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_PURCHASE);

export const editSales = (voucherID, branchId, companyId, payload) =>
  editVoucher(voucherID, branchId, companyId, payload, CONSTANTS.VOUCHER_TYPE_SALES);

//purchase voucher api
export const getSingleVoucher = (voucherId, companyId) =>
  companyAuthFetch.get(`/i-companies/${companyId}/vouchers/${voucherId}`).then(extractData);

export const currentBalance = (companyId, businessId) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/businesses/${businessId}/current-balance`)
    .then(extractData);

export const fetchIndirectExpensesAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts/indirect-expenses`).then(extractData);

export const fetchCashInHandAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts/cash-in-hand`).then(extractData);

export const fetchBankAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts/bank-accounts`).then(extractData);

export const fetchAllAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts`).then(extractData);

export const fetchSalesAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts/sales-accounts`).then(extractData);

export const fetchPurchasesAccounts = companyID =>
  companyAuthFetch.get(`/i-companies/${companyID}/accounts/purchases-accounts`).then(extractData);

export const fetchVouchersList = (companyID, startDate, endDate, voucherType) =>
  companyAuthFetch
    .get(
      `/i-companies/${companyID}/vouchers/${voucherType}?startDate=${startDate}&endDate=${endDate}`
    )
    .then(extractData);

export const getBranchDataSource = companyId =>
  companyAuthFetch.get(`/i-companies/${companyId}/i-branches`).then(extractData);

export const fetchUnpaidVoucher = (type, businessId, companyId) =>
  companyAuthFetch
    .get(`/i-companies/${companyId}/vouchers/${type}/businesses/${businessId}/?status=unpaid`)
    .then(extractData);

//view vouchers
export const createRecordPayment = (branchId, companyId, payload) =>
  companyAuthFetch.post(
    `/i-companies/${companyId}/i-branches/${branchId}/vouchers/receipt`,
    payload
  );
