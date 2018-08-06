import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { TextInputField, Dropdown } from '../../components';
import { showItemGroupDialog, updateSelectedItemGroup, createItemGroup } from '../../actions';
import { setValidationRules, validate } from '../../utils';
// import * as CONSTANTS from '../constants';

import { Dialog, MenuItem } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';

const Fields = styled.div`
  display: flex;
  padding: 30px 30px 0px 30px;
  justify-content: space-between;
`;
const FormValidationRules = {
  name: ['notEmpty'],
  code: ['notEmpty'],
  hsn: ['notEmpty'],
  taxPercentage: ['notEmpty']
};
class itemGroupDialog extends Component {
  state = {
    payload: {
      hsn: '',
      itemGroupName: '',
      itemGroupCode: '',
      taxGroup: '',
      description: ''
    },
    itemGroupFormValidations: {}
  };
  firstLetterCapital(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  validateFormFields() {
    const { selectedItemGroupDetails: { name, code, hsn, taxPercentage } } = this.props;
    let validatorFlag = true;
    validatorFlag &= validate(this, 'name', name, 'itemGroupFormValidations');
    validatorFlag &= validate(this, 'code', code, 'itemGroupFormValidations');
    validatorFlag &= validate(this, 'hsn', hsn, 'itemGroupFormValidations');
    validatorFlag &= validate(this, 'taxPercentage', taxPercentage, 'itemGroupFormValidations');
    return validatorFlag;
  }
  componentDidMount() {
    setValidationRules(FormValidationRules);
  }
  render() {
    const {
      onShowItemGroup,
      showItemGroupDialog,
      updateSelectedItemGroup,
      selectedItemGroupDetails,
      payloadData,
      createItemGroup,
      setItemPayload
    } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => {
          showItemGroupDialog();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          setValidationRules(FormValidationRules);
          if (this.validateFormFields()) {
            createItemGroup(selectedItemGroupDetails).then(() => {
              // TODO: for demo name and skubarcode generation method is repeated in multiple time.
              // need to remove and make common fn in action.
              setTimeout(() => {
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
            });
          }
        }}
      />
    ];
    return (
      <React.Fragment>
        <Dialog
          title="Item Group"
          actions={actions}
          modal={false}
          open={onShowItemGroup}
          onRequestClose={this.handleClose}
        >
          <Fields>
            <TextInputField
              id="itemGroupName"
              width="220px"
              hint="Item Group Name "
              labelSize="2px"
              // imgSrc={HandShake}
              value={this.firstLetterCapital(selectedItemGroupDetails.name)}
              labelText="Item Group Name"
              onChange={value => {
                validate(this, 'name', value, 'itemGroupFormValidations');
                updateSelectedItemGroup('name', value);
              }}
              errorText={
                this.state.itemGroupFormValidations.name &&
                !this.state.itemGroupFormValidations.name.isValid
                  ? this.state.itemGroupFormValidations.name.message
                  : ''
              }
            />
            <TextInputField
              id="itemGroupCode"
              width="220px"
              hint="Item Group Code"
              labelSize="2px"
              // imgSrc={HandShake}
              value={selectedItemGroupDetails.code}
              labelText="Item Group Code"
              onChange={value => {
                validate(this, 'code', value, 'itemGroupFormValidations');
                updateSelectedItemGroup('code', value);
              }}
              errorText={
                this.state.itemGroupFormValidations.code &&
                !this.state.itemGroupFormValidations.code.isValid
                  ? this.state.itemGroupFormValidations.code.message
                  : ''
              }
            />
          </Fields>
          <Fields>
            <TextInputField
              id="hsn"
              width="220px"
              hint="HSN"
              labelSize="2px"
              // imgSrc={HandShake}
              value={selectedItemGroupDetails.hsn}
              labelText="HSN"
              onChange={value => {
                validate(this, 'hsn', value, 'itemGroupFormValidations');
                updateSelectedItemGroup('hsn', value);
              }}
              errorText={
                this.state.itemGroupFormValidations.hsn &&
                !this.state.itemGroupFormValidations.hsn.isValid
                  ? this.state.itemGroupFormValidations.hsn.message
                  : ''
              }
            />
            <div autoFocus={true}>
              <Dropdown
                id="taxGroup"
                width="220px"
                hint="Tax Group"
                labelSize="2%"
                // imgSrc={HandShake}
                labelText="Tax Group"
                value={selectedItemGroupDetails.taxPercentage}
                onChange={value => {
                  validate(this, 'taxPercentage', value, 'itemGroupFormValidations');
                  updateSelectedItemGroup('taxPercentage', value);
                }}
                errorText={
                  this.state.itemGroupFormValidations.taxPercentage &&
                  !this.state.itemGroupFormValidations.taxPercentage.isValid
                    ? this.state.itemGroupFormValidations.taxPercentage.message
                    : ''
                }
              >
                <MenuItem value="3" primaryText="GST @ 3" />
                <MenuItem value="5" primaryText="GST @ 5" />
                <MenuItem value="12" primaryText="GST @ 12" />
                <MenuItem value="18" primaryText="GST @ 18" />
                <MenuItem value="28" primaryText="GST @ 28" />
              </Dropdown>
            </div>
          </Fields>
          <Fields>
            <TextInputField
              id="description"
              width="220px"
              hint="Write something "
              labelSize="2px"
              // imgSrc={HandShake}
              value={selectedItemGroupDetails.description}
              labelText="Description"
              onChange={value => updateSelectedItemGroup('description', value)}
            />
          </Fields>
        </Dialog>
      </React.Fragment>
    );
  }
}
const mapDispatchToProps = {
  showItemGroupDialog,
  updateSelectedItemGroup,
  createItemGroup
};
// export default itemGroupDialog;
export default connect(null, mapDispatchToProps)(itemGroupDialog);
