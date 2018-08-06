import React, { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { MenuItem } from 'material-ui';

import {
  addOtherCharges,
  addOtherChargesAfterTax,
  updateAccountField,
  drawerOpenAddAccounts,
  onFocus,
  updateCharges,
  setRoundOffValue,
  toggleOtherChargesAfterTax,
  deleteOtherChargesAfterTax,
  currentOtherChargesAfterTaxIndexFocus
} from '../../../actions/index';

import {
  FormRow,
  FormBlock,
  ItemHeader,
  AddItemText,
  FieldsContainer,
  HorizontalFields
} from '../AddVoucherStyledComponents';
import {
  Img,
  Label,
  Block,
  SubContainer,
  HorizontalBlockSingal,
  HorizontalTwoFeilds
} from '../addSPCDStyles/index';
import { DeleteIcon } from '../../../images/index';
import {
  getAccountsName,
  getOtherChargesAfterTax,
  getRoundOffValues
} from '../../../reducers/vouchers';
import { ItemAutoComplete, ItemTextInput, ItemDropdown, TextInputField } from '../../InputFields';

class OtherChargesAfterTax extends Component {
  constructor() {
    super();
    this.state = {
      otherChargesDataSourceAfterTax: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountNamesDataSource.length) {
      const item = nextProps.voucher.tempChargesAfterTax[nextProps.currentAfterTaxIndex];
      const addItems = {
        text: item ? `${item.name}` : '',
        value: (
          <MenuItem
            onClick={() => nextProps.drawerOpenAddAccounts()}
            style={{ color: 'blue' }}
            primaryText={`Add new ${item ? item.name : ''} +`}
          />
        )
      };
      this.setState({
        otherChargesDataSourceAfterTax: [...nextProps.accountNamesDataSource, addItems]
      });
    }
  }

  render() {
    const {
      roundOffValue,
      billFinalAmount,
      setRoundOffValue,
      roundOffValueDataSource,
      addOtherChargesAfterTax,
      toggleOtherChargesAfterTax,
      deleteOtherChargesAfterTax,
      currentOtherChargesAfterTaxIndexFocus,
      onHideOtherChargesAfterTax,
      otherChargesAfterTax,
      updateAccountField,
      updateCharges
    } = this.props;
    return (
      <FormRow>
        <FormBlock width="100%">
          <FieldsContainer>
            {!onHideOtherChargesAfterTax ? (
              <HorizontalFields>
                <AddItemText
                  addLineBtnVisibility="true"
                  type="addLine"
                  onClick={() => toggleOtherChargesAfterTax()}
                >
                  + Apply Other Charges (After Tax)
                </AddItemText>
              </HorizontalFields>
            ) : (
              map(otherChargesAfterTax, (item, index) => (
                <HorizontalTwoFeilds key={`12349z${index}`}>
                  <SubContainer>
                    <ItemAutoComplete
                      width="80px"
                      height="30px"
                      hint="Accounts"
                      id={`name`}
                      dataSource={this.state.otherChargesDataSourceAfterTax}
                      searchText={otherChargesAfterTax[index].name}
                      onFocus={() => {
                        currentOtherChargesAfterTaxIndexFocus(index);
                        otherChargesAfterTax[index].amount === 0 && updateCharges('', index);
                      }}
                      onUpdateInput={input => updateAccountField(input, index)}
                    />
                    <span
                      style={{ fontSize: '0.8125rem', marginTop: '0.625rem', fontStyle: 'italic' }}
                    >
                      (after tax)
                    </span>
                  </SubContainer>

                  <SubContainer>
                    <ItemTextInput
                      containerWidth="80px"
                      containerHeight="30px"
                      value={otherChargesAfterTax[index].amount}
                      onBlur={() => otherChargesAfterTax.amount === '' && updateCharges(0, index)}
                      onFocus={() => otherChargesAfterTax.amount === 0 && updateCharges('', index)}
                      onChange={input => updateCharges(input, index)}
                    />
                    <ItemHeader type="icon" container="icon">
                      <Img
                        src={DeleteIcon}
                        height="14px"
                        weight="14px"
                        onClick={() => deleteOtherChargesAfterTax(index)}
                      />
                    </ItemHeader>
                  </SubContainer>
                </HorizontalTwoFeilds>
              ))
            )}
            {onHideOtherChargesAfterTax && (
              <HorizontalFields>
                <AddItemText
                  addLineBtnVisibility="true"
                  type="addLine"
                  onClick={() => addOtherChargesAfterTax()}
                >
                  + Apply Other Charges (After Tax)
                </AddItemText>
              </HorizontalFields>
            )}

            {roundOffValueDataSource.length > 0 ? (
              <HorizontalTwoFeilds type="paddingTop">
                <Block>
                  <Label>Round Off</Label>
                  <ItemDropdown
                    width="80px"
                    value={roundOffValueDataSource[0].outputValue}
                    onChange={value => {
                      //let offset = _.filter(this.state.autoPopulateRoundoffData, item => item.outputValue === value)
                      // offset[0].offSet
                      //console.log( offset[0].offSet)
                      setRoundOffValue(value);
                      // VoucherCalculation.setOffsetForAdjustment()
                    }}
                  >
                    {map(roundOffValueDataSource, item => (
                      <MenuItem
                        key={`autoRound#123`}
                        value={item.outputValue}
                        primaryText={`${item.outputValue} (${item.offset})`}
                      />
                    ))}
                  </ItemDropdown>
                </Block>
                <TextInputField
                  readOnly
                  labelFixed={true}
                  width="170px"
                  underline={false}
                  labelSize="2%"
                  value={`Rs ${roundOffValue ? roundOffValue : billFinalAmount}`}
                  labelText="Total Amount"
                />
              </HorizontalTwoFeilds>
            ) : (
              <HorizontalBlockSingal>
                <TextInputField
                  readOnly
                  labelFixed={true}
                  width="170px"
                  underline={false}
                  labelSize="2%"
                  value={isNaN(billFinalAmount) ? `Rs 0.00` : `Rs ${billFinalAmount}`}
                  labelText="Total Amount"
                />
              </HorizontalBlockSingal>
            )}
          </FieldsContainer>
        </FormBlock>
      </FormRow>
    );
  }
}

const mapDispatchToProps = {
  addOtherCharges,
  addOtherChargesAfterTax,
  updateAccountField,
  drawerOpenAddAccounts,
  onFocus,
  updateCharges,
  setRoundOffValue,
  toggleOtherChargesAfterTax,
  deleteOtherChargesAfterTax,
  currentOtherChargesAfterTaxIndexFocus
};

const mapStateToProps = ({
  vouchers,
  vouchers: {
    purchase,
    _roundOffValue,

    _voucherModuleResults: { autoPopulateRoundoffData, billFinalAmount },
    _otherChargesAfterTax,
    app: { otherCharges: { onHideOtherChargesAfterTax } }
  }
}) => ({
  voucher: purchase,
  billFinalAmount,
  onHideOtherChargesAfterTax,
  roundOffValue: _roundOffValue,
  otherChargesAfterTax: getOtherChargesAfterTax(_otherChargesAfterTax),
  accountNamesDataSource: getAccountsName(vouchers),
  roundOffValueDataSource: getRoundOffValues(autoPopulateRoundoffData)
});
export default connect(mapStateToProps, mapDispatchToProps)(OtherChargesAfterTax);
