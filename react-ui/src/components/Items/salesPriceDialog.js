import styled from 'styled-components';
import React, { Component } from 'react';
import { TextInputField } from '../../components';
// import * as CONSTANTS from '../constants';

import { Dialog } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';

const Fields = styled.div`
  display: flex;
  padding: 30px 30px 0px 30px;
  justify-content: space-between;
`;

class itemSalesPriceDialog extends Component {
  firstLetterCapital(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  calculateWholePrice() {
    setTimeout(() => {
      const { payloadData, setItemPayload } = this.props;
      let unitSellWholeSalePrice =
        Number(payloadData.unitPurchasePrice) +
        Number(payloadData.unitPurchasePrice / 100) * Number(payloadData.wholesaleMarkup);
      setItemPayload('unitSellWholeSalePrice', unitSellWholeSalePrice);
    }, 200);
  }
  calculateRetailPrice() {
    setTimeout(() => {
      const { payloadData, setItemPayload } = this.props;
      let unitSellRetailPrice =
        Number(payloadData.unitPurchasePrice) +
        Number(payloadData.unitPurchasePrice / 100) * Number(payloadData.retailMarkup);
      setItemPayload('unitSellRetailPrice', unitSellRetailPrice);
    }, 200);
  }
  render() {
    const {
      onShowItemPrice,
      showItemSalesPrice,
      payloadData,
      setItemPayload,
      cancelItemSalesPrice,
      setShowSalesPriceValue
    } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => {
          showItemSalesPrice();
          cancelItemSalesPrice();
        }}
      />,
      <FlatButton
        label="Done"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          showItemSalesPrice();
          setShowSalesPriceValue();
        }}
      />
    ];
    return (
      <React.Fragment>
        <Dialog
          title="Add Sales Price"
          actions={actions}
          modal={false}
          open={onShowItemPrice}
          onRequestClose={this.handleClose}
        >
          <Fields>
            <TextInputField
              id="purchasePrice"
              width="220px"
              hint="Purchase Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={`Purchase Price (${payloadData.unitPurchasePrice})`}
              labelText="Purchase Price"
              onChange={value => setItemPayload('unitPurchasePrice', value)}
            />
            +
            <TextInputField
              id="wholesaleMarkup"
              width="220px"
              hint="Mark up % of Purchase Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.wholesaleMarkup}
              labelText="Mark up % of Purchase Price"
              onChange={value => {
                setItemPayload('wholesaleMarkup', value);
                this.calculateWholePrice();
              }}
            />
            =
            <TextInputField
              id="wholeSalePrice"
              width="220px"
              hint="Whole Sale Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.unitSellWholeSalePrice}
              disabled={true}
              labelText="Whole Sale Price"
              onChange={value => setItemPayload('unitSellWholeSalePrice', value)}
            />
          </Fields>
          <Fields>
            <TextInputField
              id="purchasePrice"
              width="220px"
              hint="Purchase Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={`Purchase Price (${payloadData.unitPurchasePrice})`}
              labelText="Purchase Price"
              onChange={value => setItemPayload('unitPurchasePrice', value)}
            />
            +
            <TextInputField
              id="wholesaleMarkup"
              width="220px"
              hint="Mark up % of Purchase Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.retailMarkup}
              labelText="Mark up % of Purchase Price"
              onChange={value => {
                setItemPayload('retailMarkup', value);
                this.calculateRetailPrice();
              }}
            />
            =
            <TextInputField
              id="retailPrice"
              width="220px"
              hint="Retail Price"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.unitSellRetailPrice}
              disabled={true}
              labelText="Retail Price"
              onChange={value => setItemPayload('unitSellRetailPrice', value)}
            />
          </Fields>
        </Dialog>
      </React.Fragment>
    );
  }
}

// export default itemGroupDialog;
export default itemSalesPriceDialog;
