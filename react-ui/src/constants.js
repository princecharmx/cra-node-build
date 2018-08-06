export const BASE_URL = 'https://invock-backend-staging.herokuapp.com';
export const API_URL = `${BASE_URL}/api`;
export const EDIT = `edit`;
export const CREATE = `create`;
export const UPDATE = `Update`;
export const SAVE = `Save`;
export const CONTACTS = `Contacts`;
export const SHIPPING = `Shipping`;
export const BILLING = `Billing`;

export const I_USER_ID = 'iUserId';
export const COMPANY_ID = 'tempCompanyId'; // @avinash why not iCompanyId (this is misguiding usage)

// keys for 3rd party tracking applications
export const CLEVERTAP_ID = '6ZR-KZ5-9W5Z';
export const MIXPANEL_ID = '1a4322043a0c704b67cc94f17f57244f';

// redux action types
export const REGISTER_COMPANY_PAYLOAD = 'REGISTER_COMPANY_PAYLOAD';
export const SIMILAR_COMPANIES_CHECK = 'SIMILAR_COMPANIES_CHECK';
export const SIMILAR_COMPANIES_DATA = 'SIMILAR_COMPANIES_DATA';
export const CREACTE_SALES_PURCHASE = 'CREACTE_SALES_PURCHASE';
export const VOUCHER_DURATION_TYPE = 'VOUCHER_DURATION_TYPE';
export const HANDLE_TRANSPORT_DONE = 'HANDLE_TRANSPORT_DONE';
export const UPDATE_VOUCHER_TYPES = 'UPDATE_VOUCHER_TYPES';
export const LAST_VISITED_VOUCHER = 'LAST_VISITED_VOUCHER';
export const BUSINESS_ACCOUNTS = 'BUSINESS_ACCOUNTS';
export const UPDATE_VOUCHERS = 'UPDATE_VOUCHERS';
export const TEMP_ITEM_DATA = 'TEMP_ITEM_DATA';
export const MEMBERS_LIST = 'MEMBERS_LIST';
export const ITEMS_DATA = 'ITEMS_DATA';

// voucher types
export const VOUCHER_TYPE_SALES = 'sales';
export const VOUCHER_TYPE_PURCHASE = 'purchase';
export const VOUCHER_TYPE_CREDIT_NOTE = 'credit';
export const VOUCHER_TYPE_DEBIT_NOTE = 'debit';
export const VOUCHER_TYPE_RECEIPT = 'receipt';
export const VOUCHER_TYPE_PAYMENT = 'payment';
export const VOUCHER_TYPE_JOURNAL = 'journal';
export const VOUCHER_TYPE_CHALLAN = 'challan';
export const VOUCHER_TYPE_SCHALLAN = 'schallan';
export const VOUCHER_TYPE_ALL = 'all';
//voucher status
export const VOUCHER_STATUS_PAID = 'paid';
export const VOUCHER_STATUS_UNPAID = 'unpaid';
