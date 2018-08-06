import moment from 'moment';
import cookie from 'react-cookies';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { fetchCompanyMembers } from '../actions/companies';
import { fetchCompanyItems } from '../actions/items';
import { fetchContacts } from '../actions/contacts';
import { fetchVouchers, setVoucherType, resetVoucher } from '../actions/vouchers';
import { formatDate } from '../utils';
import { Container, Loader } from '../components';
import * as CONSTANTS from '../constants';
import { setVoucherDurationType, setDate } from '../actions';

const LeftContainer = styled.div`
  width: 30%;
  display: flex;
  height: inherit;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
`;

export const HeaderContainer = styled.div`
  height: 60px;
  display: flex;
  padding: 0px 30px;
  align-items: center;
  background-color: #f9f9fb;
  justify-content: flex-start;
  border-bottom: 1px solid #bebebe;
`;

export const Text = styled.span`
  font-weight: 400;
  color: ${p => (p.color ? p.color : '#868686')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  font-size: ${p => (p.fontsize ? p.fontsize : '18px')};
`;

const Filters = styled.div`
  height: 40px;
  display: flex;
  flex-shrink: 0;
  padding: 0px 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #bebebe;
`;

const FilterText = styled.div`
  font-weight: 400;
  color: ${p => (p.color ? p.color : '#bbbbbb')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  font-size: ${p => (p.fontsize ? p.fontsize : '18px')};
`;

const VouchersList = styled.div`
  height: calc(100% - 100px);
  overflow: scroll;
  ${props =>
    props.type === 'empty' &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `};
`;

export const VoucherCard = styled(Link)`
  height: 77px;
  display: flex;
  cursor: pointer;
  padding: 0px 30px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #e7e7e8;
  background-color: ${p => (p.bgcolor ? p.bgcolor : 'transparent')};
`;

export const RightContainer = styled.div`
  display: flex;
  height: inherit;
  margin-left: 5px;
  width: calc(70% - 5px);
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
  align-items: flex-start;
  justify-content: flex-start;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Loading() {
  return (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
}

const ListSalesVoucher = Loadable({
  loader: () => import('../containers/vouchers/list/SalesVoucher'),
  loading: Loading
});

const ViewSalesVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/SalesVoucher'),
  loading: Loading
});

const ListChallanVoucher = Loadable({
  loader: () => import('../containers/vouchers/list/Challan'),
  loading: Loading
});

const ViewChallanVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/Challan'),
  loading: Loading
});

const ViewCreditNote = Loadable({
  loader: () => import('../containers/vouchers/view/CreditNote'),
  loading: Loading
});

const ListCreditNote = Loadable({
  loader: () => import('../containers/vouchers/list/CreditNote'),
  loading: Loading
});

const ListPaymentVoucher = Loadable({
  loader: () => import('../containers/vouchers/list/PaymentVoucher'),
  loading: Loading
});

const ViewPaymentVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/PaymentVoucher'),
  loading: Loading
});

const ListReceiptVoucher = Loadable({
  loader: () => import('../containers/vouchers/list/ReceiptVoucher'),
  loading: Loading
});

const ViewReceiptVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/ReceiptVoucher'),
  loading: Loading
});

const ViewDebitVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/DebitNote'),
  loading: Loading
});

const ListDebitNote = Loadable({
  loader: () => import('../containers/vouchers/list/DebitNote'),
  loading: Loading
});

const ListJournal = Loadable({
  loader: () => import('../containers/vouchers/list/Journal'),
  loading: Loading
});

const ViewJournal = Loadable({
  loader: () => import('../containers/vouchers/view/Journal'),
  loading: Loading
});

const ListPurchaseVoucher = Loadable({
  loader: () => import('../containers/vouchers/list/PurchaseVoucher'),
  loading: Loading
});

const ViewPurchaseVoucher = Loadable({
  loader: () => import('../containers/vouchers/view/PurchaseVoucher'),
  loading: Loading
});

class Vouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unmount: false,
      vouchersData: null,
      userId: cookie.load(CONSTANTS.I_USER_ID),
      companyId: cookie.load(CONSTANTS.COMPANY_ID),
      duration: this.props.getVoucherDurationType,
      selectedVoucherType: this.props.match.params.voucher || ''
    };
    this.props.setVoucherType(this.props.match.params.voucher || '');
  }

  componentDidMount() {
    // get the different voucher types data for today
    this.getVouchersData('today');

    // get business accounts data and store in redux for further usage in voucher creation.
    this.getBusinessAccountsData();

    // get items data and store it in redux for further usage in voucher creation
    this.getItemsData();

    // get the members in a particular team and store in redux for further usage
    this.getTeamMembersData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.voucherTypesUpdateState !== nextProps.voucherTypesUpdateState) {
      this.getVouchersData(this.state.duration);
    }

    if (this.props.getVoucherDurationType !== nextProps.getVoucherDurationType) {
      this.setState({
        duration: nextProps.getVoucherDurationType
      });
    }
  }

  /**
   * @param {String} type specify the type (today/week/month/year) for setting startDate & endDate
   */
  getVouchersData(type) {
    this.props.setVoucherDurationType(type);

    let tempEndDate = moment()._d;
    let tempStartDate;

    switch (type) {
      case 'week':
        tempStartDate = moment().add(-1, 'week')._d;
        break;
      case 'month':
        tempStartDate = moment().add(-1, 'month')._d;
        break;
      case 'year':
        tempStartDate = moment().add(-1, 'year')._d;
        break;
      case 'today':
      default:
        tempStartDate = moment().startOf('day')._d;
        break;
    }

    let startDate = formatDate(tempStartDate);
    let endDate = formatDate(tempEndDate);

    this.props.setDate(startDate, endDate);
    this.props.fetchVouchers(this.state.companyId, startDate, endDate);
  }

  getBusinessAccountsData() {
    this.props.fetchContacts(this.state.companyId);
  }

  getItemsData() {
    this.props.fetchCompanyItems();
  }

  getTeamMembersData() {
    this.props.fetchCompanyMembers(this.state.companyId);
  }

  setSelectedVoucherType(item) {
    this.setState({ selectedVoucherType: item._id });
    this.props.setVoucherType(item._id);
  }

  handleUnmount = () => {
    this.setState(({ unmount }) => ({ unmount: !unmount }));
  };
  render() {
    const { match } = this.props;
    const { vouchers: { loadingVoucherList: loading, voucherList: vouchersData } } = this.props;
    if (loading && vouchersData === null) {
      return (
        <Container>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        </Container>
      );
    }

    return (
      <Container>
        <LeftContainer>
          <HeaderContainer>
            <Text> Vouchers </Text>
          </HeaderContainer>

          <Filters>
            <FilterText
              fontsize="16px"
              cursor="pointer"
              onClick={() => this.getVouchersData('today')}
              color={this.state.duration === 'today' ? '#000' : '#bbbbbb'}
            >
              {' '}
              Today{' '}
            </FilterText>

            <FilterText
              fontsize="16px"
              cursor="pointer"
              onClick={() => this.getVouchersData('week')}
              color={this.state.duration === 'week' ? '#000' : '#bbbbbb'}
            >
              {' '}
              Week{' '}
            </FilterText>

            <FilterText
              fontsize="16px"
              cursor="pointer"
              onClick={() => this.getVouchersData('month')}
              color={this.state.duration === 'month' ? '#000' : '#bbbbbb'}
            >
              {' '}
              Month{' '}
            </FilterText>

            <FilterText
              fontsize="16px"
              cursor="pointer"
              onClick={() => this.getVouchersData('year')}
              color={this.state.duration === 'year' ? '#000' : '#bbbbbb'}
            >
              {' '}
              Year{' '}
            </FilterText>
          </Filters>

          {vouchersData !== null &&
            !isEmpty(vouchersData) && (
              <VouchersList>
                {map(vouchersData, (item, index) => (
                  <VoucherCard
                    key={index}
                    replace
                    onClick={() => {
                      this.setSelectedVoucherType(item);
                      this.props.resetVoucher();
                    }}
                    to={`/${this.state.companyId}/home/${match.params.page}/${item._id}/list`}
                    bgcolor={
                      this.state.selectedVoucherType === item._id ? '#f9f9fb' : 'transparent'
                    }
                  >
                    <Text fontSize="16px" cursor="pointer">
                      {' '}
                      {`${item.value} (${parseFloat(item.total).toFixed(2)})`}{' '}
                    </Text>
                  </VoucherCard>
                ))}
              </VouchersList>
            )}
        </LeftContainer>

        <RightContainer type="empty">
          {match.params.type === 'list' &&
            match.params.voucher === 'schallan' && <ListChallanVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'schallan' && <ViewChallanVoucher {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'sales' && <ListSalesVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'sales' && <ViewSalesVoucher {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'payment' && <ListPaymentVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'payment' && <ViewPaymentVoucher {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'credit_note' && <ListCreditNote {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'credit_note' && <ViewCreditNote {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'receipt' && <ListReceiptVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'receipt' && <ViewReceiptVoucher {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'debit_note' && <ListDebitNote {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'debit_note' && <ViewDebitVoucher {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'journal' && <ListJournal {...this.props} />}

          {match.params.type === 'list' &&
            match.params.voucher === 'purchase' && <ListPurchaseVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'purchase' && <ViewPurchaseVoucher {...this.props} />}

          {match.params.type === 'view' &&
            match.params.voucher === 'journal' && <ViewJournal {...this.props} />}
        </RightContainer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { vouchersUpdateState, getVoucherDurationType, voucherTypesUpdateState, vouchers } = state;
  return {
    vouchersUpdateState,
    getVoucherDurationType,
    voucherTypesUpdateState,
    vouchers
  };
};

export default connect(mapStateToProps, {
  setVoucherDurationType,
  fetchCompanyMembers,
  fetchCompanyItems,
  fetchVouchers,
  fetchContacts,
  setDate,
  resetVoucher,
  setVoucherType
})(Vouchers);
