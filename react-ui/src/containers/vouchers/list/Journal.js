import axios from 'axios';
import moment from 'moment';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as api from '../../../api/vouchers';
import { formatDate } from '../../../utils';
import {
  Text,
  Loader,
  StatBox,
  ListItem,
  ItemCell,
  LinkText,
  SearchBar,
  CellContent,
  SearchInput,
  VouchersList,
  TitleContainer,
  SearchAndStats,
  StatsContainer,
  ItemCellContent,
  ListItemsContainer,
  VouchersListHeader,
  TitleLeftContainer,
  TitleRightContainer,
  VouchersListContainer
} from '../../../components';
import cookie from 'react-cookies';
import { SearchIcon, VouchersLogo } from '../../../images';
import { COMPANY_ID, I_USER_ID } from '../../../constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 30px 0px 0px 0px;
`;

const Button = styled.button`
  height: 30px;
  display: flex;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 20px;
  text-align: center;
  align-items: center;
  border-radius: 100px;
  text-decoration: none;
  justify-content: center;
  background-color: #27d466;
  border: 1px solid #27d466;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  &:hover {
    box-shadow: none;
    transition: box-shadow 600ms none;
  }
  &:focus {
    outline: none;
  }
`;

const StyledImg = styled.img`
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
  padding-right: ${p => (p.padding === 'right' ? '5px' : '0px')};
`;

const LoaderContainer = styled.div`
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

const AddJournal = Loadable({
  loader: () => import('../add/AddJournalContainer'),
  loading: Loading
});

class ListJournal extends Component {
  state = {
    openAddJournal: false,
    filterVouchersKey: 'credit',
    displaySearch: false,
    searchText: '',
    creditAmountTotal: '',
    debitAmountTotal: '',
    userId: cookie.load(I_USER_ID),
    companyId: cookie.load(COMPANY_ID),
    vouchersList: []
  };

  componentDidMount() {
    const companyAccessToken = cookie.load(`${this.state.userId}@${this.state.companyId}`);
    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';
      this.getJournalsData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.vouchersUpdateState !== nextProps.vouchersUpdateState) {
      this.getJournalsData();
    }
  }

  getJournalsData() {
    const endDate = formatDate(moment()._d);
    const startDate = this.props.vouchers.getDate.startDate;
    api.fetchVouchersList(this.state.companyId, startDate, endDate, 'journal').then(res => {
      this.setState({
        vouchersList: res
      });
    });
  }

  renderSearchAndStats() {
    return (
      <SearchAndStats>
        {!this.state.displaySearch && (
          <SearchBar onClick={() => this.setState({ displaySearch: true })}>
            <StyledImg src={SearchIcon} height="16px" width="16px" padding="right" />
            <Text fontSize="14px" color="#95989A">
              Search vouchers by 'Voucher No'
            </Text>
          </SearchBar>
        )}
        {this.state.displaySearch && (
          <SearchInput
            autoFocus={true}
            onBlur={() => {
              if (this.state.searchText === '') {
                this.setState({
                  displaySearch: false
                });
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                this.setState({
                  searchText: '',
                  displaySearch: false
                });
              }
            }}
            onChange={e => this.setState({ searchText: e.target.value })}
          />
        )}

        {map(this.state.vouchersList, (items, index) => (
          <StatsContainer key={index}>
            <StatBox
              // onClick={() => this.setState({ filterVouchersKey: 'credit' })}
              bgColor={this.state.filterVouchersKey === 'credit' ? '#f9f9fb' : 'transparent'}
            >
              <Text fontSize="18px" color="#000000">
                {' '}
                {items.debitAmountTotal !== '' ? `Rs ${items.debitAmountTotal}` : `Rs 0.00`}{' '}
              </Text>
              <Text fontSize="14px" color="#26D367" paddingTop="15px">
                {' '}
                Credit{' '}
              </Text>
            </StatBox>

            <StatBox
              // onClick={() => this.setState({ filterVouchersKey: 'debit' })}
              bgColor={this.state.filterVouchersKey === 'debit' ? '#f9f9fb' : 'transparent'}
            >
              <Text fontSize="18px" color="#000000">
                {' '}
                {items.creditAmountTotal !== '' ? `Rs ${items.creditAmountTotal}` : `Rs 0.00`}{' '}
              </Text>
              <Text fontSize="14px" color="#F3B296" paddingTop="15px">
                {' '}
                Debit{' '}
              </Text>
            </StatBox>
          </StatsContainer>
        ))}
      </SearchAndStats>
    );
  }

  renderVouchersList() {
    const { match } = this.props;
    return (
      <VouchersListContainer>
        {isEmpty(this.state.vouchersList) === true ? (
          <VouchersList type="empty">
            <StyledImg src={VouchersLogo} height="100px" width="100px" />
            <Text fontSize="14px" color="#95989A" paddingTop="30px">
              {' '}
              You currently don't have any vouchers, click on the '+ Create Journal' to create a new
              sales voucher{' '}
            </Text>
          </VouchersList>
        ) : (
          <VouchersList>
            <VouchersListHeader>
              <CellContent color="#868686" width="20%" fontSize="16px" textalign="center">
                {' '}
                Date{' '}
              </CellContent>

              <CellContent color="#868686" width="25%" fontSize="16px" textalign="center">
                {' '}
                Voucher No{' '}
              </CellContent>

              <CellContent color="#868686" width="25%" fontSize="16px" textalign="center">
                {' '}
                Debit Amount{' '}
              </CellContent>

              <CellContent color="#868686" width="30%" fontSize="16px" textalign="center">
                {' '}
                Credit Amount{' '}
              </CellContent>
            </VouchersListHeader>

            <ListItemsContainer>
              {map(this.state.vouchersList[0].documents, (items, index) => (
                <ListItem key={items._id}>
                  <ItemCell width="20%" textalign="center">
                    <ItemCellContent textalign="center" fontSize="14px" color="#000000">
                      {' '}
                      {moment(items.createdAt).format('MM/DD/YYYY')}{' '}
                    </ItemCellContent>
                  </ItemCell>

                  <ItemCell width="25%" textalign="center">
                    <LinkText
                      fontSize="14px"
                      color="#428BCA"
                      cursor="pointer"
                      textalign="center"
                      to={`/${match.params.id}/home/${match.params.page}/${
                        match.params.action
                      }/view/${items._id}`}
                    >
                      {' '}
                      {`#${items.voucherNo}`}{' '}
                    </LinkText>
                  </ItemCell>

                  <ItemCell width="25%" textalign="center">
                    <ItemCellContent
                      textalign="center"
                      fontSize="14px"
                      color={
                        items.debit === '0.00' || items.debit === '0' || items.debit === '0.0'
                          ? '#bbbbbb'
                          : '#000000'
                      }
                    >
                      {' '}
                      {`Rs ${items.debitTotalAmount}`}{' '}
                    </ItemCellContent>
                  </ItemCell>

                  <ItemCell width="30%" textalign="center">
                    <ItemCellContent
                      textalign="center"
                      fontSize="14px"
                      color={
                        items.credit === '0.00' || items.credit === '0' || items.credit === '0.0'
                          ? '#bbbbbb'
                          : '#000000'
                      }
                    >
                      {' '}
                      {`Rs ${items.creditTotalAmount}`}{' '}
                    </ItemCellContent>
                  </ItemCell>
                </ListItem>
              ))}
            </ListItemsContainer>
          </VouchersList>
        )}
      </VouchersListContainer>
    );
  }

  render() {
    return (
      <Container>
        <TitleContainer>
          <TitleLeftContainer>
            <Text fontSize="16px">Journal</Text>
            <Text fontSize="18px">Today (0)</Text>
          </TitleLeftContainer>

          <TitleRightContainer>
            <Button onClick={() => this.setState({ openAddJournal: true })}>
              + Create Journal Voucher
            </Button>
          </TitleRightContainer>
        </TitleContainer>

        {this.renderSearchAndStats()}

        {this.renderVouchersList()}

        <AddJournal
          openAddDrawer={this.state.openAddJournal}
          updateVoucherList={() => this.getJournalsData()}
          voucherCloseClick={() => this.setState({ openAddJournal: false })}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ vouchers }) => ({
  vouchers
});
export default connect(mapStateToProps)(ListJournal);
