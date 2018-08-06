import {
  AdminIcon,
  detailedView,
  condenced,
  period,
  groups,
  ledgerWise,
  unCollapse,
  collapse
} from './images';
// import { AddItemText } from './components/Voucher/AddVoucherStyledComponents';

export const ThemeDefaultValues = {
  report: {
    detailedView: detailedView,
    condenced: condenced,
    period: period,
    ledgerWise: groups,
    groups: ledgerWise,
    unCollapse: unCollapse,
    collapse: collapse
  },
  addVoucherImage: {
    partyLinkImg: AdminIcon,
    voucherDetailsImg: AdminIcon,
    shippingDetailsImg: AdminIcon,
    transportDetailsImg: AdminIcon,
    voucherRefNoImg: AdminIcon
  },
  baseFontFamily: 'roboto',
  baseFontSize: '16px',
  cardHeaderFontSize: '14px',
  cardHeaderFontColor: '#4545',
  cardBackgroundColor: '#f5f5f5;',
  cardSubHeaderFontSize: '15px',

  tabFontFamily: 'roboto',
  tabFontWeight: '500',
  tabFontColor: '#868686',
  tabFontSize: '14px',

  addLinkColor: 'rgb(36,0,255,0.9)',
  containerBorderColor: 'rgba(112, 112, 112, 0.2)'
};
