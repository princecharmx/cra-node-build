import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';

import * as companiesApi from '../api/companies';

import { Add } from '../images';
import { getItems, getOnShowAddItems } from '../reducers';
import { fetchCompanyItems, toggleAddItems } from '../actions';
import { Button, Loader } from '../components';
import { ListHeader, AddItem } from '../containers';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  background: transparent;
  justify-content: space-between;
`;

const ListContainer = styled.div`
  width: 30%;
  display: flex;
  height: inherit;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
`;

const SelectedItemContainer = styled.div`
  display: flex;
  height: inherit;
  margin-left: 30px;
  width: calc(70% - 30px);
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
  ${props =>
    props.type === 'empty'
      ? `
    align-items: center;
    justify-content: center;
  `
      : `
    align-items: center;
    justify-content: flex-start;
  `};
`;

const StyledSpan = styled.span`
  width: 100%;
  color: #2e6eaf;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
`;

const ItemsTitle = styled.div`
  ${props =>
    props.type === 'empty'
      ? `
    width: 100%;
    color: #b2b2b2;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
  `
      : `
    text-align: center;
    font-size: 15px;
    color: #121212;
  `};
`;

const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

const ItemsCard = styled.div`
  height: 80px;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7e7e8;
  transition: all 500ms ease-in-out;
  &:hover {
    background-color: #f9f9fb;
    transition: all 500ms ease-in-out;
  }
`;

const ItemsDetails = styled.div`
  height: 40px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const ItemsSubTitle = styled.div`
  font-size: 14px;
  color: #b2b2b2;
`;

const ContactsList = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;

const LoaderContainer = styled.div`
  display: flex;
  width: inherit;
  height: inherit;
  align-items: center;
  justify-content: center;
`;

class Items extends Component {
  state = {
    items: null,
    addItems: false
  };

  componentDidMount() {
    // get the items from the server
    this.getItems();
  }

  getItems() {
    const { fetchCompanyItems, items } = this.props;
    fetchCompanyItems();
    this.setState({
      items: items,
      addItems: false
    });
  }

  handleAddItem(payload) {
    const { iCompanyId } = this.state;
    companiesApi
      .addItem(iCompanyId, payload)
      .then(this.getItems)
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  renderItemsList = ({
    id,
    name,
    description,
    unitSellWholeSalePrice,
    unitPurchasePrice,
    unit
  }) => (
    <ItemsCard
      key={id}
      to="#"
      replace
      onClick={() => this.setState({ selectedItems: name, selectedItemsId: id })}
      bgcolor={this.state.selectedItemsId === id ? '#f9f9fb' : '#ffffff'}
    >
      <ItemsDetails>
        <ItemsTitle>{name}</ItemsTitle>
        {description && <ItemsSubTitle>{description}</ItemsSubTitle>}
      </ItemsDetails>

      <ItemsDetails>
        <ItemsTitle>{`Sell: Rs.${unitSellWholeSalePrice}/${unit}`}</ItemsTitle>
        <ItemsSubTitle>{`Buy: Rs.${unitPurchasePrice}/${unit}`}</ItemsSubTitle>
      </ItemsDetails>
    </ItemsCard>
  );

  render() {
    if (!this.state.items) {
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
        <ListContainer>
          <ListHeader
            icon={Add}
            type="title"
            to="#"
            replace
            title="Items"
            onClick={this.props.toggleAddItems}
          />

          <ContactsList>{this.state.items.map(item => this.renderItemsList(item))}</ContactsList>
        </ListContainer>

        <SelectedItemContainer type="empty">
          <ItemsTitle type="empty">
            Download Invock app and automatically <br /> sync Items with web
          </ItemsTitle>

          <ButtonExtended
            type="empty"
            to="#"
            replace
            onClick={() => window.open('https://play.google.com/store')}
          >
            Download App
          </ButtonExtended>

          <ItemsTitle type="empty">
            or <br /> <br />{' '}
            <StyledSpan onClick={this.props.toggleAddItems}>click here to add an item</StyledSpan>
          </ItemsTitle>
        </SelectedItemContainer>

        <AddItem
          match={this.props.match}
          openAddItem={this.props.onShowAddItems}
          getItems={() => this.getItems()}
          itemCloseClick={() => this.setState({ addItems: false })}
          clearAddItemFormFields={this.state.clearAddItemFormFields}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  items: getItems(state),
  onShowAddItems: getOnShowAddItems(state)
});

export default connect(mapStateToProps, { fetchCompanyItems, toggleAddItems })(Items);
