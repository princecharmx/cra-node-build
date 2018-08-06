import { navigate } from './nav';
import { VOUCHER_TYPE_PURCHASE } from '../constants';

export const appInit = () => (dispatch, getState) => {
  const { user, router, currentCompany } = getState();
  var reg = new RegExp(/view\/shared-voucher/g);
  const isPublicUrl = reg.test(router.location.pathname);
  // if accesstoken is absent and url is also not follow public url
  // format then redirect to login
  if (!user.accessToken && !isPublicUrl) {
    navigate(dispatch, `/login`);
    return false;
  }

  if (router.location.pathname === '/' && currentCompany.id) {
    // TODO: We should direct it to centralized router nav which should fire this
    const page = 'vouchers';
    const type = VOUCHER_TYPE_PURCHASE;
    navigate(dispatch, `/${currentCompany.id}/home/${page}/${type}/list`);
  }
};

export * from './companies';
export * from './reports';
export * from './vouchers';
export * from './contacts';
export * from './items';
export * from './auth';
export * from './purchaseVouchersOld';
