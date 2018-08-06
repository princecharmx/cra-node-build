import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import styled from 'styled-components';

import { SearchIcon, VouchersLogo } from '../../../../images';
import { getFilteredData } from '../../../../utils';
import {
  Text,
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
} from '../../../../components';

const Container = styled.div`
  width: 100%;
  height: 100%;
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

class ReceiptAndPayment extends Component {
  state = {
    searchText: '',
    displaySearch: false,
    filterVouchersKey: 'all'
  };

  renderSearchAndStats() {
    const { totalCount, totalAmount } = this.props;

    return (
      <SearchAndStats>
        {!this.state.displaySearch && (
          <SearchBar onClick={() => this.setState({ displaySearch: true })}>
            <StyledImg src={SearchIcon} height="16px" width="16px" padding="right" />
            <Text fontSize="14px" color="#95989A">
              Search vouchers by 'Party Name'
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

        <StatsContainer>
          <StatBox bgColor={this.state.filterVouchersKey === 'all' ? '#f9f9fb' : 'transparent'}>
            <Text fontSize="18px" color="#000000">
              {' '}
              {`Rs ${totalAmount}`}{' '}
            </Text>
            <Text fontSize="14px" color="#428BCA" paddingTop="15px">
              {' '}
              {`Total (${totalCount})`}{' '}
            </Text>
          </StatBox>
        </StatsContainer>
      </SearchAndStats>
    );
  }

  renderVouchersList() {
    const { match, voucherType } = this.props;

    return (
      <VouchersListContainer>
        {_.isEmpty(this.props.vouchersList) === true ? (
          <VouchersList type="empty">
            <StyledImg src={VouchersLogo} height="100px" width="100px" />
            <Text fontSize="14px" color="#95989A" paddingTop="30px">
              {' '}
              {`You currently don't have any vouchers, click on the '+ Create ${voucherType} Voucher' to
              create a new ${voucherType} voucher`}{' '}
            </Text>
          </VouchersList>
        ) : (
          <VouchersList>
            <VouchersListHeader>
              <CellContent fontSize="15px" color="#868686" width="17.5%">
                {' '}
                Date{' '}
              </CellContent>
              <CellContent fontSize="15px" color="#868686" width="25%">
                {' '}
                Party Name{' '}
              </CellContent>
              <CellContent fontSize="15px" color="#868686" width="17.5%">
                {' '}
                Voucher No{' '}
              </CellContent>
              <CellContent fontSize="15px" color="#868686" width="20%">
                {' '}
                Payment Method{' '}
              </CellContent>
              <CellContent fontSize="15px" color="#868686" width="20%">
                {' '}
                Prepared By{' '}
              </CellContent>
            </VouchersListHeader>
            <ListItemsContainer>
              {_.map(
                getFilteredData(this.props.vouchersList, 'partyName', this.state.searchText),
                (item, index) => (
                  <ListItem key={index}>
                    <ItemCell width="17.5%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {moment(item.createdAt).format('MM/DD/YYYY')}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="25%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {item.party.name}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="17.5%">
                      <LinkText
                        fontSize="14px"
                        color="#428BCA"
                        cursor="pointer"
                        to={`/${match.params.id}/home/${match.params.page}/${
                          match.params.voucher
                        }/view/${item._id}`}
                      >
                        {' '}
                        {`#${item.voucherNo}`}{' '}
                      </LinkText>
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {`Rs ${item.paidAmount}`}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="20%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {item.paymentMethod}{' '}
                      </ItemCellContent>
                    </ItemCell>

                    <ItemCell width="20%">
                      <ItemCellContent fontSize="14px" color="#000000">
                        {' '}
                        {item.preparedBy[0].name}{' '}
                      </ItemCellContent>
                    </ItemCell>
                  </ListItem>
                )
              )}
            </ListItemsContainer>
          </VouchersList>
        )}
      </VouchersListContainer>
    );
  }

  setDurationType() {
    switch (this.props.getVoucherDurationType) {
      case 'month':
        return `Month (${this.props.totalCount})`;
      case 'week':
        return `Week (${this.props.totalCount})`;
      case 'year':
        return `Year (${this.props.totalCount})`;
      default:
      case 'today':
        return `Today (${this.props.totalCount})`;
    }
  }

  render() {
    const { voucherType } = this.props;
    return (
      <Container>
        <TitleContainer>
          <TitleLeftContainer>
            <Text fontSize="16px">{`${voucherType} Voucher`}</Text>
            <Text fontSize="18px">{this.setDurationType()}</Text>
          </TitleLeftContainer>

          <TitleRightContainer>
            <Button onClick={() => this.props.openAddReceiptNote()}>
              + {`Create ${voucherType} Voucher`}
            </Button>
          </TitleRightContainer>
        </TitleContainer>

        {this.renderSearchAndStats()}

        {this.renderVouchersList()}
      </Container>
    );
  }
}

const mapStateToProps = ({ getVoucherDurationType }) => ({
  getVoucherDurationType
});
export default connect(mapStateToProps)(ReceiptAndPayment);
