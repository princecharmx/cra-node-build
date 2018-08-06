import { Component } from 'react';
export class CreditDebitDecorators extends Component {
  currentBalanceSymbol = '';
  colorCode = '';
  getStateAndHelper() {
    const { crDrValue } = this.props;
    if (crDrValue < 0) {
      this.currentBalanceSymbol = 'Cr';
      this.colorCode = '#DF5656';
    } else {
      this.currentBalanceSymbol = 'Dr';
      this.colorCode = '#26D367';
    }
    return {
      currentBalanceSymbol: this.currentBalanceSymbol,
      colorCode: this.colorCode
    };
  }
  render() {
    return this.props.children(this.getStateAndHelper());
  }
}
