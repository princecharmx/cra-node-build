import React, { Component } from 'react';
import _ from 'lodash';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getUnpaidVouchersList } from '../../../../reducers';
import { Drawer, MenuItem, Checkbox } from 'material-ui/';

import * as api from '../../../../api/vouchers';
import { fetchUnpaidVouchers } from '../../../../actions';
import { ListHeader } from '../../../../containers';
import * as CONSTANTS from '../../../../constants';
import { setValidationRules, validate } from '../../../../utils';
import { Cancel } from '../../../../images';
import AgainsVoucherDailog from '../../../../components/Voucher/addRPComponent/AgainstVoucherDialog';
import { arrayToObject } from '../../../../utils';
import {
  Button,
  DateTime,
  Dropdown,
  ItemDropdown,
  ItemTextInput,
  VerifiedByList,
  ItemCellContent,
  AutoFillInput,
  TextInputField,
  SelectedVoucherText,
  NotesContainer,
  NotesInputFields
} from '../../../../components';

import {
  Form,
  Fields,
  FormRow,
  FormBlock,
  SingleRow,
  SummaryTitle,
  SummaryValue,
  SummaryBlock,
  FormBlockTitle,
  HorizontalBlock,
  BusinessAccountAddress
} from '../../../../components/Voucher/AddVoucherStyledComponents';

const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

const ItemBlock = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 30px);
  justify-content: space-between;
  ${p => p.view === 'horizontal' && `flex-direction: row;`} ${p =>
      p.view === 'vertical' && `flex-direction: column;`};
`;

const TextBold = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding-top: 5px;
`;

const FormValidationRules = {
  voucherNo: ['notEmpty']
};

class AddRPVoucher extends Component {
  state = {
    onHideDrawer: false,
    searchText: '',
    showNotes: false,
    dueDateObj: {},
    issueDateObj: {},
    addressCheck: false,
    totalAmountPaid: '',
    currentBalance: null,
    editableVoucherData: {
      0: {
        voucherNo: '',
        amountDue: 0
      }
    },
    addVoucherValidations: {},
    voucherItemsSuggestions: [],
    selectedBusinessAccount: null,
    userId: cookie.load(CONSTANTS.I_USER_ID),
    businessAccountsSuggestions: [],
    companyId: cookie.load(CONSTANTS.COMPANY_ID),
    selectedVouchers: {},
    unpaidVouchers: [],
    allVouchersSelected: false,
    payload: {},
    addPayload: {
      paymentMethod: '',
      notifyParty: false,
      adjustmentMethod: 'Against Voucher',
      internalNotes: '',
      issueDate: '',
      narration: '',
      verifiedBy: '',
      voucherNo: ''
    }
  };

  componentDidMount() {
    setValidationRules(FormValidationRules);
    this.populateBusinessAccountSuggestions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.populateVouchersData && Object.keys(nextProps.populateVouchersData).length > 0) {
      let editableVoucherData = _.map(nextProps.populateVouchersData.voucherList, voucher => {
        return {
          voucherNo: voucher.voucherNo,
          paidAmount: voucher.paidAmount
        };
      });

      this.setState(
        {
          editableVoucherData,
          totalAmountPaid: nextProps.populateVouchersData.billFinalAmount,
          searchText: nextProps.populateVouchersData.party.accountName,
          addPayload: {
            ...this.state.addPayload,
            voucherNo: nextProps.populateVouchersData.voucherNo,
            narration: nextProps.populateVouchersData.narration,
            paymentMethod: nextProps.populateVouchersData.paymentMethod
          },
          selectedBusinessAccount: {
            ...this.state.selectedAccount,
            address: nextProps.populateVouchersData.party.address,
            aliasName: nextProps.populateVouchersData.party.aliasName
          }
        },
        () => {
          this.getSelectedAccountDetails();
          this.populateBusinessAccountSuggestions();
          this.populateUnpaidVoucher();
        }
      );
    }
    if (this.props.resetToDefaultState !== nextProps.resetToDefaultState) {
      this.resetToDefaultState();
    }

    if (
      this.props.contacts &&
      this.props.contacts.contactList.length < nextProps.contacts.contactList.length
    ) {
      this.populateContactsDetails(nextProps);
    }
  }

  populateContactsDetails(nextProps) {
    let newContact = nextProps.contacts.contactList.reverse()[0];
    this.setState(
      {
        selectedBusinessAccount: newContact,
        payload: {
          ...this.state.payload,
          billToBusinessId: newContact.id
        },
        party: {
          ...this.state.party,
          refId: newContact.id,
          name: newContact.name,
          gstin: newContact.gstin !== '' ? newContact.gstin : newContact.pancard,
          address: newContact.address,
          accountName: newContact.name,
          gstPartyType: newContact.gstBusinessType
        }
      },
      () => this.populateShippingAddress(newContact)
    );
  }

  populateShippingAddress(newContact) {
    if (this.state.addressCheck) {
      this.setState({
        shippingAddress: {
          ...this.state.shippingAddress,
          city: newContact.city || '',
          state: newContact.state || '',
          address: newContact.address || '',
          pincode: newContact.pincode || '',
          country: 'India'
        }
      });
    }
    this.setShippingAddress();
  }

  autoPopulateState(nextProps) {
    let editableVoucherData = _.map(nextProps.populateVouchersData.voucherList, voucher => {
      return {
        voucherNo: voucher.voucherNo,
        paidAmount: voucher.paidAmount
      };
    });

    this.setState(
      {
        editableVoucherData,
        totalAmountPaid: nextProps.populateVouchersData.billFinalAmount,
        searchText: nextProps.populateVouchersData.party.accountName,
        addPayload: {
          ...this.state.addPayload,
          voucherNo: nextProps.populateVouchersData.voucherNo,
          narration: nextProps.populateVouchersData.narration,
          paymentMethod: nextProps.populateVouchersData.paymentMethod
        },
        selectedBusinessAccount: {
          ...this.state.selectedAccount,
          address: nextProps.populateVouchersData.party.address,
          aliasName: nextProps.populateVouchersData.party.aliasName
        }
      },
      () => {
        this.getSelectedAccountDetails();
        this.populateBusinessAccountSuggestions();
        this.populateUnpaidVoucher();
      }
    );
  }

  populateUnpaidVoucher() {
    let editableVoucherData = this.state.editableVoucherData;
    let val = _.filter(
      this.state.unpaidVouchers,
      (item, index) =>
        _.indexOf(_.map(editableVoucherData, item => item.voucherNo), item.voucherNo) !== -1
    );
    let value = _.merge(val, editableVoucherData);
    this.setState({
      selectedVouchers: value
    });
  }

  handleAddVerifiedBy() {
    let filteredItem = _.find(
      this.props.teamMembersData,
      item => item.id === this.state.selectedUserId
    );

    if (
      _.find(this.state.verifiedBy, item => item.refId === this.state.selectedUserId) !== undefined
    ) {
      this.setState({
        selectedUserId: ''
      });
    } else {
      this.setState({
        verifiedBy: {
          ...this.state.verifiedBy,
          [this.state.verifiedByIndex + 1]: {
            refId: filteredItem.id,
            name: filteredItem.name
          }
        },
        selectedUserId: '',
        verifiedByIndex: this.state.verifiedByIndex + 1
      });
    }
  }

  populateBusinessAccountSuggestions() {
    const { businessAccountsData, drawerOpenAddContact } = this.props;
    const value = _.map(businessAccountsData, item => {
      return {
        text: item.aliasName,
        value: item.aliasName
      };
    });
    const addItems = {
      text: `${this.state.searchText}`,
      value: (
        <MenuItem
          onClick={drawerOpenAddContact}
          style={{ color: 'blue' }}
          primaryText={`Add Contacts ${this.state.searchText} +`}
        />
      )
    };

    this.setState({
      businessAccountsSuggestions: [...value, addItems]
    });
  }

  getSelectedAccountDetails() {
    const { businessAccountsData } = this.props;

    let selectedAccount = _.filter(
      businessAccountsData,
      item => item.aliasName === this.state.searchText
    );

    if (selectedAccount.length > 0) {
      let tempObj = selectedAccount[0];

      this.setState(
        {
          selectedBusinessAccount: tempObj,
          party: {
            ...this.state.party,
            refId: tempObj.id,
            name: tempObj.name,
            gstin: tempObj.gstin !== '' ? tempObj.gstin : tempObj.pancard,
            address: tempObj.address,
            accountName: tempObj.aliasName,
            gstPartyType: tempObj.gstBusinessType
          }
        },
        () => {
          this.getCurrentBalance();
          this.getUnpaidVouchers();
        }
      );
    }
  }

  getCurrentBalance() {
    api.currentBalance(this.state.companyId, this.state.selectedBusinessAccount.id).then(data =>
      this.setState({
        currentBalance: data.currentBalance
      })
    );
  }

  handleOnChecked = () => {
    this.setState(
      {
        allVouchersSelected: !this.state.allVouchersSelected
      },
      () => {
        if (this.state.allVouchersSelected === true) {
          this.setState(
            {
              selectedVouchers: arrayToObject(this.state.unpaidVouchers)
            },
            this.calculateTotalPaidAmount
          );
        }
      }
    );
  };

  handlePayAmountChange = (value, index) => {
    this.setState(
      {
        selectedVouchers: {
          ...this.state.selectedVouchers,
          [index]: {
            ...this.state.selectedVouchers[index],
            paidAmount: parseFloat(value) || ''
          }
        }
      },
      this.calculateTotalPaidAmount
    );
  };

  handleSelectedVoucherClick = (item, index) => {
    //setState for selected voucher
    if (_.find(this.state.selectedVouchers, item) === undefined) {
      this.setState(
        {
          selectedVouchers: {
            ...this.state.selectedVouchers,
            [index]: {
              ...item,
              paidAmount: 0
            }
          }
        },
        this.calculateTotalPaidAmount
      );
    } else {
      this.setState(
        {
          selectedVouchers: _.omit(this.state.selectedVouchers, index)
        },
        () => {
          if (_.size(this.state.selectedVouchers) !== this.state.unpaidVouchers.length) {
            this.setState({
              allVouchersSelected: false
            });
          }
          this.calculateTotalPaidAmount();
        }
      );
    }
  };

  getUnpaidVouchers() {
    const type =
      this.props.VoucherType === CONSTANTS.VOUCHER_TYPE_RECEIPT
        ? CONSTANTS.VOUCHER_TYPE_SALES
        : CONSTANTS.VOUCHER_TYPE_PURCHASE;
    this.props.fetchUnpaidVouchers(type, this.state.selectedBusinessAccount.id);
  }

  toggleOnHideDrawer = () => {
    this.setState(state => ({
      onHideDrawer: !state.onHideDrawer
    }));
  };
  calculateTotalPaidAmount() {
    const add = (a, b) => a + b;
    const paidAmount = _.map(this.state.selectedVouchers, items => items.paidAmount);

    const totalAmountPaid = paidAmount.reduce(add);
    this.setState({
      totalAmountPaid: totalAmountPaid
    });
  }

  resetToDefaultState() {
    this.setState({
      selectedVouchers: {},
      dueDateObj: {},
      issueDateObj: {},
      addressCheck: false,
      totalAmountPaid: '',
      currentBalance: null,
      addVoucherValidations: {},
      voucherItemsSuggestions: [],
      unpaidVouchers: [],
      allVouchersSelected: false,
      payload: {},
      addPayload: {
        paymentMethod: '',
        adjustmentMethod: 'Against Voucher',
        internalNotes: '',
        issueDate: '',
        narration: '',
        verifiedBy: '',
        voucherNo: ''
      }
    });
  }

  render() {
    const { openAddDrawer, voucherCloseClick, VoucherType } = this.props;
    return (
      <Drawer width="50%" docked={false} open={openAddDrawer} openSecondary={true}>
        <ListHeader
          type="title"
          to="#"
          replace
          icon={Cancel}
          imgWidth="15px"
          imgHeight="15px"
          title={`Add ${VoucherType} Voucher`}
          onClick={voucherCloseClick}
        />

        <Form>
          <FormRow type="firstRow">
            <FormBlock width="45%">
              <FormBlockTitle>Party Name</FormBlockTitle>
              <Fields>
                <HorizontalBlock>
                  {/* remember that you need to send an array of values for the dataSource */}
                  <AutoFillInput
                    width="200px"
                    hint="Enter Party Name"
                    labelText="Business Contact"
                    searchText={this.state.searchText}
                    dataSource={this.state.businessAccountsSuggestions}
                    onUpdateInput={input =>
                      this.setState({ searchText: input }, () => {
                        this.getSelectedAccountDetails();
                        this.populateBusinessAccountSuggestions();
                      })
                    }
                  />
                </HorizontalBlock>

                {this.state.selectedBusinessAccount && (
                  <Fields type="noLeftPadding">
                    <BusinessAccountAddress>
                      {this.state.selectedBusinessAccount.aliasName}, <br />
                      {this.state.selectedBusinessAccount.address}, <br />
                      {this.state.selectedBusinessAccount.city},{' '}
                      {this.state.selectedBusinessAccount.pincode}, <br />
                      {this.state.selectedBusinessAccount.gstin &&
                        `GSTIN: ${this.state.selectedBusinessAccount.gstin}`}
                      {this.state.selectedBusinessAccount.pancard &&
                        `Pan Card No: ${this.state.selectedBusinessAccount.pancard}`}{' '}
                      <br />
                    </BusinessAccountAddress>
                    <TextBold>
                      {this.state.currentBalance &&
                        `Current Balance: Rs.${this.state.currentBalance.toFixed(2)} `}
                    </TextBold>
                  </Fields>
                )}
              </Fields>
            </FormBlock>

            <FormBlock width="55%">
              <FormBlockTitle>Voucher Details</FormBlockTitle>
              <Fields>
                <HorizontalBlock type="withErrors">
                  <TextInputField
                    width="170px"
                    labelSize="2%"
                    hint="123WERQWE"
                    labelText={`${VoucherType} Voucher No`}
                    value={this.state.addPayload.voucherNo}
                    onBlur={() =>
                      validate(
                        this,
                        'voucherNo',
                        this.state.addPayload.voucherNo,
                        'addVoucherValidations'
                      )
                    }
                    errorText={
                      this.state.addVoucherValidations.voucherNo &&
                      !this.state.addVoucherValidations.voucherNo.isValid
                        ? this.state.addVoucherValidations.voucherNo.message
                        : ''
                    }
                    onChange={value => {
                      this.setState({
                        addPayload: {
                          ...this.state.addPayload,
                          voucherNo: value.toUpperCase() || ''
                        }
                      });
                    }}
                  />

                  <DateTime
                    hint="Date"
                    width="170px"
                    labelText="Date"
                    value={this.state.issueDateObj}
                    onChange={date => {
                      let tempDate = JSON.stringify(date).replace('"', '');
                      tempDate = tempDate.replace('"', '');

                      this.setState({
                        issueDateObj: date,
                        addPayload: {
                          ...this.state.addPayload,
                          issueDate: tempDate
                        }
                      });
                    }}
                  />
                </HorizontalBlock>

                <HorizontalBlock type="withErrors">
                  <TextInputField
                    readOnly
                    labelFixed={true}
                    width="170px"
                    underline={false}
                    labelSize="2%"
                    hint="Against Voucher"
                    labelText="Adjustment Method"
                  />
                  <Dropdown
                    width="170px"
                    labelSize="2%"
                    labelText="Payment Method"
                    value={this.state.addPayload.paymentMethod}
                    errorText={
                      this.state.addVoucherValidations.accountType &&
                      !this.state.addVoucherValidations.accountType.isValid
                        ? this.state.addVoucherValidations.accountType.message
                        : ''
                    }
                    onChange={value => {
                      this.setState({
                        addPayload: {
                          ...this.state.addPayload,
                          paymentMethod: value
                        }
                      });
                    }}
                  >
                    <MenuItem value="Cash" primaryText="Cash" />
                    <MenuItem value="Check" primaryText="Check" />
                  </Dropdown>
                </HorizontalBlock>
              </Fields>
            </FormBlock>
          </FormRow>

          {this.state.selectedBusinessAccount && (
            <FormRow type="secondRow">
              <FormBlock width="100%">
                <FormBlockTitle>Against Voucher</FormBlockTitle>

                {_.size(this.state.selectedVouchers) > 0 ? (
                  <Fields type="secondRow">
                    {_.map(this.state.selectedVouchers, (item, index) => (
                      <HorizontalBlock key={index}>
                        <TextInputField
                          readOnly
                          underline={false}
                          width="150px"
                          labelSize="2%"
                          hint="Select unpaid vouchers"
                          labelText="Voucher No"
                          value={item.voucherNo}
                        />

                        <TextInputField
                          readOnly
                          underline={false}
                          width="150px"
                          labelSize="2%"
                          hint="Pls select unpaid vouchers"
                          labelText="Amount Due"
                          value={item.dueAmount}
                        />

                        <TextInputField
                          type="number"
                          width="150px"
                          labelSize="2%"
                          hint="Amount Paid"
                          labelText="Amount Paid"
                          value={item.paidAmount}
                          errorText={
                            item.paidAmount > item.dueAmount
                              ? 'Enter amount should not exced due amount'
                              : ''
                          }
                          onChange={value => {
                            this.setState(
                              {
                                selectedVouchers: {
                                  ...this.state.selectedVouchers,
                                  [index]: {
                                    ...this.state.selectedVouchers[index],
                                    paidAmount: parseFloat(value) || ''
                                  }
                                }
                              },
                              this.calculateTotalPaidAmount
                            );
                          }}
                        />
                      </HorizontalBlock>
                    ))}
                    <HorizontalBlock>
                      <TextInputField
                        readOnly
                        width="150px"
                        labelSize="2%"
                        value={this.state.totalAmountPaid}
                        underline={false}
                        labelText="Total Amount Paid"
                      />
                    </HorizontalBlock>
                  </Fields>
                ) : (
                  <Fields>
                    <TextBold>Please select unpaid vouchers</TextBold>
                  </Fields>
                )}
              </FormBlock>
            </FormRow>
          )}
          <div onClick={this.toggleOnHideDrawer}> Against voucher</div>
          <AgainsVoucherDailog
            handlePayAmountChange={this.handlePayAmountChange}
            onHideDrawer={this.state.onHideDrawer}
            totalAmountPaid={this.state.totalAmountPaid}
            handleOnChecked={this.handleOnChecked}
            toggleOnHideDrawer={this.toggleOnHideDrawer}
            unPaidVouchers={this.props.unpaidVouchers}
            selectedBusinessAccount={this.state.selectedBusinessAccount}
            allVouchersSelected={this.state.allVouchersSelected}
            selectedVouchers={this.state.selectedVouchers}
            handleSelectedVoucherClick={this.handleSelectedVoucherClick}
          />
          <FormRow type="fourthRow">
            <FormBlock width="100%">
              <FormBlockTitle>Summary</FormBlockTitle>
              <Fields>
                <ItemBlock>
                  <SummaryBlock marginBottom="0px">
                    <SummaryTitle>Total Price</SummaryTitle>
                    <SummaryValue> {`Rs ${this.state.totalAmountPaid}`} </SummaryValue>
                  </SummaryBlock>

                  <TextInputField
                    width="250px"
                    labelSize="2%"
                    hint="Narration"
                    labelText="Narration"
                    value={this.state.addPayload.narration}
                    onChange={value => {
                      this.setState({
                        addPayload: {
                          ...this.state.addPayload,
                          narration: value
                        }
                      });
                    }}
                  />
                </ItemBlock>
              </Fields>
            </FormBlock>
          </FormRow>

          <FormRow type="fourthRow">
            <FormBlock width="50%">
              <FormBlockTitle>For Internal Use</FormBlockTitle>
              <Fields>
                <ItemBlock view="vertical">
                  <SummaryBlock marginBottom="0px" paddingTop="15px">
                    <SummaryTitle>Verified By</SummaryTitle>
                    <VerifiedByList>
                      <VerifiedByList>
                        {_.size(this.state.verifiedBy) > 0 &&
                          _.map(this.state.verifiedBy, (item, index) => (
                            <ItemCellContent key={index} fontSize="14px" color="#868686">
                              {item.name}
                            </ItemCellContent>
                          ))}
                      </VerifiedByList>
                      <VerifiedByList
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ItemDropdown
                          width="100px"
                          id={`verifiedBy`}
                          value={this.state.selectedUserId}
                          onChange={value => {
                            this.setState({
                              selectedUserId: value
                            });
                          }}
                        >
                          {this.props.teamMembersData &&
                            _.map(this.props.teamMembersData, item => (
                              <MenuItem value={item.id} primaryText={item.name} key={item.id} />
                            ))}
                        </ItemDropdown>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#428BCA',
                            marginLeft: '10px',
                            height: 'unset',
                            cursor: 'pointer',
                            lineHeight: '30px'
                          }}
                          onClick={() =>
                            this.state.selectedUserId !== '' && this.handleAddVerifiedBy()
                          }
                        >
                          + add
                        </span>
                      </VerifiedByList>
                    </VerifiedByList>
                  </SummaryBlock>
                </ItemBlock>
              </Fields>
            </FormBlock>

            <FormBlock width="50%">
              <FormBlockTitle />
              <Fields>
                <SummaryBlock marginBottom="0px" paddingTop="30px">
                  {this.state.showNotes === false ? (
                    <SelectedVoucherText
                      cursor="pointer"
                      color="#428BCA"
                      fontSize="15px"
                      onClick={() => {
                        this.setState({
                          showNotes: !this.state.showNotes
                        });
                      }}
                    >
                      Add Internal Notes
                    </SelectedVoucherText>
                  ) : (
                    <NotesContainer>
                      <NotesInputFields type="formField">
                        <ItemTextInput
                          field="name"
                          page="showNote"
                          id="internalNotes"
                          containerHeight="20px"
                          containerWidth="180px"
                          hint="Add an internal note"
                          value={this.state.addPayload.internalNotes}
                          onChange={value => {
                            this.setState({
                              addPayload: {
                                ...this.state.addPayload,
                                internalNotes: value
                              }
                            });
                          }}
                        />
                      </NotesInputFields>
                    </NotesContainer>
                  )}
                </SummaryBlock>
              </Fields>
            </FormBlock>
          </FormRow>

          <SingleRow>
            <Checkbox
              label="Send a receipt"
              style={{ width: '145px' }}
              iconStyle={{ fill: '#bbbbbb' }}
              checked={this.state.addPayload.notifyParty}
              labelStyle={{
                fontSize: '14px',
                color: '#bbbbbb',
                fontFamily: 'Dax Regular'
              }}
              onCheck={() => {
                this.setState({
                  addPayload: {
                    ...this.state.addPayload,
                    notifyParty: !this.state.addPayload.notifyParty
                  }
                });
              }}
            />
          </SingleRow>

          <SingleRow type="lastRow">
            <HorizontalBlock type="buttons">
              <ButtonExtended
                to="#"
                margintop="0px"
                replace
                onClick={() => {
                  let filteredPayload = _.omit(this.state.addPayload, 'internalNotes');
                  if (this.props.updateVoucherFlag) {
                    this.setState(
                      {
                        payload: {
                          ...filteredPayload,
                          party: { ...this.state.party },
                          billFinalAmount: this.state.totalAmountPaid,
                          voucherList: _.map(this.state.selectedVouchers, (item, index) => {
                            return {
                              refVoucherId: item.id,
                              voucherNo: item.voucherNo,
                              paidAmount: item.paidAmount
                            };
                          }),
                          paidAmount: this.state.totalAmountPaid,
                          verifiedBy: []
                        }
                      },
                      () => {
                        this.props.handleEditButton(this.state.payload);
                      }
                    );
                  }

                  if (!this.props.updateVoucherFlag) {
                    this.setState(
                      {
                        payload: {
                          party: { ...this.state.party },
                          billFinalAmount: this.state.totalAmountPaid,
                          ...this.state.addPayload,
                          voucherList: _.map(this.state.selectedVouchers, (item, index) => {
                            return {
                              refVoucherId: item.id,
                              voucherNo: item.voucherNo,
                              paidAmount: item.paidAmount
                            };
                          }),
                          paidAmount: this.state.totalAmountPaid,
                          verifiedBy: []
                        }
                      },
                      () => this.props.handleSaveButton(this.state.payload)
                    );
                  }
                }}
              >
                Save
              </ButtonExtended>
            </HorizontalBlock>
          </SingleRow>
        </Form>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const {
    businessAccountsData,
    getTempContactData,
    teamMembersData,
    voucherTypesUpdateState
  } = state;
  return {
    voucherTypesUpdateState,
    businessAccountsData,
    getTempContactData,
    teamMembersData,
    unpaidVouchers: getUnpaidVouchersList(state)
  };
};

export default connect(mapStateToProps, { fetchUnpaidVouchers })(AddRPVoucher);
