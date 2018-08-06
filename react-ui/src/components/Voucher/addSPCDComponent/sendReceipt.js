import React from 'react';
import { Checkbox } from 'material-ui';

import { SingleRow, HorizontalBlock } from '../AddVoucherStyledComponents';
import { ButtonExtended } from '../addSPCDStyles/index';

const SendReceiptCheckbox = ({ payload, toggleNotifyParty }) => {
  return (
    <SingleRow>
      <Checkbox
        label="Send a receipt"
        style={{ width: '145px' }}
        iconStyle={{ fill: '#bbbbbc' }}
        checked={payload.notifyParty}
        labelStyle={{
          fontSize: '14px',
          color: '#bbbbbc',
          fontFamily: 'Dax Regular'
        }}
        onCheck={() => toggleNotifyParty()}
      />
    </SingleRow>
  );
};

const PurchaseSalesSaveButton = ({ onClikSaveButton }) => {
  return (
    <SingleRow type="lastRow">
      <HorizontalBlock type="buttons">
        <ButtonExtended
          to="#"
          margintop="0px"
          replace
          onClick={() => {
            onClikSaveButton();
            // if (this.validateFormFields()) {
            //   if (this.state.payload.accountType === `${this.props.voucherType}`) {
            //     let itemCheck = _.some(this.state.tempItems, item => item.itemName === '');
            //     if (!itemCheck) {
            //       this.setState(
            //         {
            //           payload: {
            //             ...this.state.payload,
            //             party: { ...this.state.party },
            //             tax: [...this.state.taxBreakup],
            //             itemList: objectToArray(this.state.tempItems),
            //             verifiedBy: objectToArray(this.state.verifiedBy),
            //             shippingAddress: { ...this.state.shippingAddress }
            //           }
            //         },
            //         () => this.props.handleSaveButtonClick(this.state.payload)
            //       );
            //     } else {
            //       alert('Please enter at least one item');
            //     }
            //   } else {
            //     this.setState(
            //       {
            //         payload: {
            //           ...this.state.payload,
            //           party: { ...this.state.party },
            //           tax: [...this.state.taxBreakup],
            //           itemList: objectToArray(this.state.tempItems),
            //           verifiedBy: objectToArray(this.state.verifiedBy),
            //           shippingAddress: { ...this.state.shippingAddress }
            //         }
            //       },
            //       () => this.props.handleSaveButtonClick(this.state.payload)
            //     );
            //   }
            // }
            // this.setState({
            //})
          }}
        >
          Save
        </ButtonExtended>
      </HorizontalBlock>
    </SingleRow>
  );
};

export { SendReceiptCheckbox, PurchaseSalesSaveButton };
