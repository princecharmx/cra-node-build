import axios from 'axios';
import ReactDOM from 'react-dom';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { Drawer, MenuItem } from 'material-ui/';

import { ListHeader } from '../containers';
import { ThemeDefaultValues } from '../ThemeProvider';
import {
  storeItems,
  storeTempItemData,
  toggleAddItems,
  getItemGroup,
  setItemPayload,
  createItem,
  showItemSalesPrice,
  cancelItemSalesPrice,
  resetItemPayload,
  setShowSalesPriceValue,
  setItemErrorAction
} from '../actions';
import * as CONSTANTS from '../constants';
import {
  getShowItemGroup,
  getSelectedItemGroup,
  getAllItemGroups,
  getItemPayloadDetails,
  getShowItemSalesPrice,
  getShowSalesPriceValue,
  getAllBranches,
  getItemError
} from '../reducers';
import { Cancel } from '../images';
import { Button, TextInputField, Dropdown } from '../components';
import { setValidationRules, validate, moveToField } from '../utils';
import ItemGroupPicker from '../components/Items/ItemGroupPicker';
import ItemGroupDialog from '../components/Items/itemGroupDialog';
import SalesPriceDialog from '../components/Items/salesPriceDialog';
import { AddDetailsLink } from '../components/Voucher/AddDetailsLink';

const Title = styled.div`
  width: 100%;
  display: flex;
  min-height: 30px;
  text-indent: 30px;
  margin-top: 2rem;
  align-items: center;
  font-family: 'roboto';
  color: ${ThemeDefaultValues.tabFontColor};
  font-size: ${ThemeDefaultValues.tabFontSize};
  font-weight: ${ThemeDefaultValues.tabFontWeight};
`;

const Fields = styled.div`
  display: flex;
  padding: 30px 30px 0px 30px;
  justify-content: space-between;
`;

const ButtonPostion = styled.div`
  width: 100%;
  display: flex;
  padding-top: 60px;
  align-items: center;
  justify-content: center;
`;

const navigationArr = [
  ['name', 'sku'],
  ['sell', 'discountAmount'],
  ['description'],
  ['hsn', 'tax'],
  ['availableQty', 'units']
];

const FormValidationRules = {
  itemGroupId: ['notEmpty'],
  collectionType: ['notEmpty'],
  baseMaterial: ['notEmpty'],
  color: ['notEmpty'],
  unit: ['notEmpty'],
  warehouseLocation: ['notEmpty'],
  storageLocation: ['notEmpty', 'minLength2'],
  unitPurchasePrice: ['notEmpty']
};

class AddItem extends Component {
  state = {
    payload: {
      hsn: '',
      name: '',
      unit: '',
      iconChange: true,
      skuBarcode: '',
      description: '',
      availableQty: '',
      taxPercentage: '',
      unitSellPrice: '',
      discountPercentage: ''
    },
    itemFormValidations: {},
    iUserId: cookie.load(CONSTANTS.I_USER_ID),
    iCompanyId: cookie.load(CONSTANTS.COMPANY_ID)
  };
  componentDidMount() {
    this.getItemGroups();
    setValidationRules(FormValidationRules);
    ReactDOM.findDOMNode(this.inputTax)
      .querySelector('button')
      .addEventListener('keyup', e => this.onKeyPress(e, 'tax'));

    ReactDOM.findDOMNode(this.inputUnits)
      .querySelector('button')
      .addEventListener('keyup', e => this.onKeyPress(e, 'units'));
  }
  getItemGroups() {
    const { getItemGroup } = this.props;
    getItemGroup();
  }
  componentWillUnmount() {
    ReactDOM.findDOMNode(this.inputTax)
      .querySelector('button')
      .removeEventListener('keyup', e => this.onKeyPress(e, 'tax'));

    ReactDOM.findDOMNode(this.inputUnits)
      .querySelector('button')
      .removeEventListener('keyup', e => this.onKeyPress(e, 'units'));

    // this.props.resetItemPayload();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onKeyPress(e, feildName) {
    if (
      e.keyCode === 37 ||
      e.keyCode === 38 ||
      e.keyCode === 39 ||
      e.keyCode === 40 ||
      e.keyCode === 13
    ) {
      let focusName = moveToField(e, feildName, navigationArr);
      let targetField = this['input' + this.capitalizeFirstLetter(focusName)];

      switch (focusName) {
        case 'tax':
          ReactDOM.findDOMNode(targetField)
            .querySelector('button')
            .focus();
          break;
        case 'units':
          ReactDOM.findDOMNode(targetField)
            .querySelector('button')
            .focus();
          break;
        default:
          targetField.focus();
      }
    }
  }

  setInitialState() {
    this.setState({
      payload: {
        hsn: '',
        name: '',
        unit: '',
        skuBarcode: '',
        description: '',
        availableQty: '',
        taxPercentage: '',
        unitSellPrice: '',
        discountPercentage: ''
      },
      iconChange: false
    });
  }

  updateItemsData() {
    const { iCompanyId } = this.state;

    const ITEMS_GET_URL = `${CONSTANTS.API_URL}/i-companies/${iCompanyId}/items`;

    axios
      .get(ITEMS_GET_URL)
      .then(response => response.data)
      .then(data => this.props.storeItems(data))
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  validateFormFields() {
    const {
      payloadData: {
        storageLocation,
        collectionType,
        baseMaterial,
        color,
        unit,
        warehouseLocation,
        itemGroupId
      }
    } = this.props;
    let validatorFlag = true;
    validatorFlag &= validate(this, 'storageLocation', storageLocation, 'itemFormValidations');
    validatorFlag &= validate(this, 'collectionType', collectionType, 'itemFormValidations');
    validatorFlag &= validate(this, 'baseMaterial', baseMaterial, 'itemFormValidations');
    validatorFlag &= validate(this, 'color', color, 'itemFormValidations');
    validatorFlag &= validate(this, 'unit', unit, 'itemFormValidations');
    validatorFlag &= validate(this, 'warehouseLocation', warehouseLocation, 'itemFormValidations');
    validatorFlag &= validate(this, 'itemGroupId', itemGroupId, 'itemFormValidations');
    return validatorFlag;
  }
  generateItemGroupNameForSku(str) {
    let matches = str.match(/\b(\w)/g);
    let nameCode = matches.join('');
    if (nameCode.length === 1) {
      nameCode = str.substring(0, 2);
    }
    return nameCode.toUpperCase().substring(0, 2);
  }
  generateItemName() {
    // TODO: need to fix get updated value from redux state.
    // use setTimeout because state was not getting update before it is been used.
    setTimeout(() => {
      let { payloadData, selectedItemGroupDetails, setItemPayload } = this.props;
      let name = `${selectedItemGroupDetails.name}-${payloadData.collectionType}-${
        payloadData.baseMaterial
      }-${payloadData.color}`;
      setItemPayload('name', name);

      let skuCode = `${selectedItemGroupDetails.code
        .substring(0, 2)
        .toUpperCase()}-${payloadData.collectionType
        .substring(0, 2)
        .toUpperCase()}-${payloadData.baseMaterial
        .substring(0, 2)
        .toUpperCase()}-${payloadData.color.substring(0, 2).toUpperCase()}`;
      setItemPayload('skuBarcode', skuCode);
    }, 200);
  }

  getAllBranches() {
    let { branches = [] } = this.props;
    let branchArray =
      Boolean(branches.length) &&
      branches.map(item => {
        return <MenuItem value={item.id} primaryText={item.name} />;
      });
    return branchArray;
  }

  render() {
    const {
      openAddItem,
      toggleAddItems,
      payloadData,
      setItemPayload,
      createItem,
      showItemSalesPrice,
      cancelItemSalesPrice,
      showSalesPriceValue,
      setShowSalesPriceValue,
      itemError
    } = this.props;
    return (
      <Drawer width="65%" docked={false} openSecondary={true} open={openAddItem}>
        <ListHeader
          imgWidth="15px"
          imgHeight="15px"
          title="Add Items"
          icon={Cancel}
          to="#"
          onClick={() => {
            toggleAddItems();
            this.props.resetItemPayload();
            cancelItemSalesPrice();
            this.setInitialState();
          }}
        />
        <form name="itemForm">
          <Fields>
            <ItemGroupPicker
              itemGroups={this.props.itemGroups}
              payloadData={payloadData}
              validateFn={value => {
                validate(this, 'itemGroupId', value, 'itemFormValidations');
              }}
              formValidation={this.state.itemFormValidations}
            />
            <ItemGroupDialog
              onShowItemGroup={this.props.onShowItemGroup}
              selectedItemGroupDetails={this.props.selectedItemGroupDetails}
              payloadData={payloadData}
              setItemPayload={setItemPayload}
            />
            <div autoFocus={true}>
              <Dropdown
                id="collectionType"
                width="220px"
                hint="Collection Type"
                labelSize="2%"
                labelText="Collection Type*"
                value={payloadData.collectionType}
                inputRef={select => (this.inputTax = select)}
                onChange={value => {
                  setItemPayload('collectionType', value);
                  this.generateItemName();
                  validate(this, 'collectionType', value, 'itemFormValidations');
                }}
                errorText={
                  this.state.itemFormValidations.collectionType &&
                  !this.state.itemFormValidations.collectionType.isValid
                    ? this.state.itemFormValidations.collectionType.message
                    : ''
                }
              >
                <MenuItem value="ring" primaryText="Ring" />
                <MenuItem value="chain" primaryText="Chain" />
                <MenuItem value="mangalSutra" primaryText="Mangal Sutra" />
                <MenuItem value="necklace" primaryText="Necklace" />
              </Dropdown>
            </div>
            <div autoFocus={true}>
              <Dropdown
                id="baseMaterial"
                width="220px"
                hint="Base Material"
                labelSize="2%"
                labelText="Base Material"
                value={payloadData.baseMaterial}
                inputRef={select => (this.inputTax = select)}
                onChange={value => {
                  setItemPayload('baseMaterial', value);
                  this.generateItemName();
                  validate(this, 'baseMaterial', value, 'itemFormValidations');
                }}
                errorText={
                  this.state.itemFormValidations.baseMaterial &&
                  !this.state.itemFormValidations.baseMaterial.isValid
                    ? this.state.itemFormValidations.baseMaterial.message
                    : ''
                }
              >
                <MenuItem value="brass" primaryText="Brass" />
                <MenuItem value="goldPlated" primaryText="Gold Plated" />
                <MenuItem value="silver" primaryText="Silver" />
                <MenuItem value="titanium" primaryText="Titanium" />
              </Dropdown>
            </div>
          </Fields>

          <Fields>
            <div autoFocus={true}>
              <Dropdown
                id="color"
                width="220px"
                hint="Color"
                labelSize="2%"
                // imgSrc={HandShake}
                labelText="Color"
                // onKeyUp={e => this.onKeyPress(e, 'color')}
                value={payloadData.color}
                inputRef={select => (this.inputTax = select)}
                onChange={value => {
                  setItemPayload('color', value);
                  this.generateItemName();
                  validate(this, 'color', value, 'itemFormValidations');
                }}
                errorText={
                  this.state.itemFormValidations.color &&
                  !this.state.itemFormValidations.color.isValid
                    ? this.state.itemFormValidations.color.message
                    : ''
                }
              >
                <MenuItem value="yellow" primaryText="Yellow" />
                <MenuItem value="white" primaryText="White" />
                <MenuItem value="silver" primaryText="Silver" />
                <MenuItem value="purple" primaryText="Purple" />
                <MenuItem value="black" primaryText="Black" />
                <MenuItem value="orange" primaryText="Orange" />
              </Dropdown>
            </div>

            <TextInputField
              id="desciption"
              width="220px"
              hint="Write something "
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.description}
              inputRef={input => {
                this.inputDescription = input;
              }}
              // onKeyUp={e => {
              //   this.onKeyPress(e, 'description');
              // }}
              labelText="Description"
              onChange={value => setItemPayload('description', value)}
            />
            <div autoFocus={true}>
              <Dropdown
                id="units"
                width="220px"
                hint="Units"
                labelSize="2%"
                // imgSrc={HandShake}
                labelText="Units"
                // onKeyUp={e => this.onKeyPress(e, 'units')}
                value={payloadData.unit}
                inputRef={select => (this.inputUnits = select)}
                onChange={value => {
                  setItemPayload('unit', value);
                  validate(this, 'unit', value, 'itemFormValidations');
                }}
                errorText={
                  this.state.itemFormValidations.unit &&
                  !this.state.itemFormValidations.unit.isValid
                    ? this.state.itemFormValidations.unit.message
                    : ''
                }
              >
                <MenuItem value="pcs" primaryText="Pcs" />
                <MenuItem value="grams" primaryText="Grams" />
                <MenuItem value="kgs" primaryText="Kgs" />
              </Dropdown>
            </div>
          </Fields>

          <Fields>
            <div autoFocus={true}>
              <Dropdown
                id="warehouseLocation"
                width="220px"
                hint="Warehouse Location"
                labelSize="2%"
                // imgSrc={HandShake}
                labelText="Warehouse Location"
                // onKeyUp={e => this.onKeyPress(e, 'warehouseLocation')}
                value={payloadData.warehouseLocation}
                inputRef={select => (this.inputTax = select)}
                onChange={value => {
                  setItemPayload('warehouseLocation', value);
                  validate(this, 'warehouseLocation', value, 'itemFormValidations');
                }}
                errorText={
                  this.state.itemFormValidations.warehouseLocation &&
                  !this.state.itemFormValidations.warehouseLocation.isValid
                    ? this.state.itemFormValidations.warehouseLocation.message
                    : ''
                }
              >
                {this.getAllBranches()}
                {/* <MenuItem value="api" primaryText="need to fix api" /> */}
              </Dropdown>
            </div>
            <TextInputField
              id="storageLocation"
              width="220px"
              hint="Eg. 1st floor,shelf no 12"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.storageLocation}
              inputRef={input => {
                this.storageLocation = input;
              }}
              // onKeyUp={e => {
              //   this.onKeyPress(e, 'storageLocation');
              // }}
              labelText="Storage Location"
              onBlur={event =>
                validate(this, 'storageLocation', event.target.value, 'itemFormValidations')
              }
              onChange={value => {
                validate(this, 'storageLocation', value, 'itemFormValidations');
                setItemPayload('storageLocation', value);
              }}
              errorText={
                this.state.itemFormValidations.storageLocation &&
                !this.state.itemFormValidations.storageLocation.isValid
                  ? this.state.itemFormValidations.storageLocation.message
                  : ''
              }
            />
            <TextInputField
              id="purchasePrice"
              width="220px"
              hint="In Rupees"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.unitPurchasePrice}
              inputRef={input => {
                this.purchasePrice = input;
              }}
              type="number"
              // onKeyUp={e => {
              //   this.onKeyPress(e, 'purchasePrice');
              // }}
              labelText="Purchase Price"
              onChange={value => {
                setItemPayload('unitPurchasePrice', value);
                cancelItemSalesPrice();
                validate(this, 'unitPurchasePrice', value, 'itemFormValidations');
                let unitSellWholeSalePrice =
                  Number(value) + Number(value / 100) * Number(payloadData.wholesaleMarkup);
                let unitSellRetailPrice =
                  Number(value) + Number(value / 100) * Number(payloadData.retailMarkup);
                setItemPayload('unitSellWholeSalePrice', unitSellWholeSalePrice);
                setItemPayload('unitSellRetailPrice', unitSellRetailPrice);
              }}
              errorText={
                this.state.itemFormValidations.unitPurchasePrice &&
                !this.state.itemFormValidations.unitPurchasePrice.isValid
                  ? this.state.itemFormValidations.unitPurchasePrice.message
                  : ''
              }
            />
          </Fields>
          <Fields>
            {showSalesPriceValue ? (
              <Fields>
                <TextInputField
                  id="unitSellWholeSalePrice"
                  width="200px"
                  hint="Unit Sell WholeSale Price"
                  labelSize="2px"
                  value={payloadData.unitSellWholeSalePrice}
                  disabled={true}
                  labelText="Unit Sell WholeSale Price"
                  // onChange={value => setItemPayload('name', value)}
                />
                <TextInputField
                  id="unitSellRetailPrice"
                  width="200px"
                  hint="Unit Sell Retail Price"
                  labelSize="2px"
                  value={payloadData.unitSellRetailPrice}
                  disabled={true}
                  labelText="Unit Sell Retail Price"
                  // onChange={value => setItemPayload('unitSellRetailPrice', value)}
                />
              </Fields>
            ) : (
              <AddDetailsLink
                // img={ThemeDefaultValues.addVoucherImage.partyLinkImg}
                addDetailsFieds={'Sales Price'}
                onClick={showItemSalesPrice}
              />
            )}
          </Fields>
          <SalesPriceDialog
            onShowItemPrice={this.props.showItemSalesPriceDialog}
            showItemSalesPrice={showItemSalesPrice}
            payloadData={payloadData}
            setItemPayload={setItemPayload}
            cancelItemSalesPrice={cancelItemSalesPrice}
            setShowSalesPriceValue={setShowSalesPriceValue}
          />
          <Title>This Section will be Autogenerated</Title>
          <Fields>
            <TextInputField
              id="itemName"
              width="360px"
              hint="Group-Name Collection-Type Base-Material Color"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.name}
              inputRef={input => {
                this.itemName = input;
              }}
              disabled={true}
              // onKeyUp={e => {
              //   this.onKeyPress(e, 'itemName');
              // }}
              labelText="Item Name"
              onChange={value => setItemPayload('name', value)}
              errorText={itemError.name ? itemError.name : ''}
            />
            <TextInputField
              id="sku"
              width="260px"
              hint="First two letters"
              labelSize="2px"
              // imgSrc={HandShake}
              value={payloadData.skuBarcode}
              inputRef={input => {
                this.sku = input;
              }}
              disabled={true}
              // onKeyUp={e => {
              //   this.onKeyPress(e, 'sku');
              // }}
              labelText="Sku (custom)"
              onChange={value => setItemPayload('skuBarcode', value)}
              errorText={itemError.skuBarcode ? itemError.skuBarcode : ''}
            />
          </Fields>
          <ButtonPostion>
            <Button
              to="#"
              replace
              margintop="0px"
              onClick={() => {
                setValidationRules(FormValidationRules);
                if (this.validateFormFields()) {
                  createItem();
                }
              }}
            >
              Save
            </Button>
          </ButtonPostion>
        </form>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedItemGroupDetails: getSelectedItemGroup(state),
    onShowItemGroup: getShowItemGroup(state),
    itemGroups: getAllItemGroups(state),
    payloadData: getItemPayloadDetails(state),
    showItemSalesPriceDialog: getShowItemSalesPrice(state),
    showSalesPriceValue: getShowSalesPriceValue(state),
    branches: getAllBranches(state),
    itemError: getItemError(state)
  };
};
export default connect(mapStateToProps, {
  storeItems,
  storeTempItemData,
  toggleAddItems,
  getItemGroup,
  setItemPayload,
  createItem,
  showItemSalesPrice,
  cancelItemSalesPrice,
  resetItemPayload,
  setShowSalesPriceValue,
  setItemErrorAction
})(AddItem);
