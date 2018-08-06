import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';
import { Drawer, MenuItem, Checkbox } from 'material-ui/';

// import * as api from '../../../api/vouchers';
import { ListHeader } from '../../../containers';
import { updateVoucherTypes, createJournalVoucher } from '../../../actions';
import * as CONSTANTS from '../../../constants';
import { Cancel, DeleteIcon } from '../../../images';
import { objectToArray, setValidationRules, validate, formatDate } from '../../../utils';

import {
  Button,
  DateTime,
  ItemDropdown,
  ItemTextInput,
  TextInputField,
  NotesContainer,
  VerifiedByList,
  ItemCellContent,
  NotesInputFields,
  ItemAutoComplete,
  SelectedVoucherText
} from '../../../components';

import {
  Form,
  Fields,
  FormRow,
  FormBlock,
  SingleRow,
  StyledImg,
  ItemHeader,
  AddItemText,
  SummaryTitle,
  SummaryBlock,
  FormBlockTitle,
  FieldsContainer,
  HorizontalBlock,
  HorizontalFields
} from '../../../components/Voucher/AddVoucherStyledComponents';

const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

const SubFields = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
`;

const SubTotalFeilds = styled.div`
  width: 40%;
  display: flex;
  justify-content: space-around;
`;

const FormValidationRules = {
  voucherNo: ['notEmpty']
};

class AddJournalContainer extends Component {
  state = {
    tempJournals: {
      0: {
        name: '',
        description: '',
        creditAmount: 0,
        debitAmount: 0,
        refAccountId: '',
        accountGroupName: ''
      },

      1: {
        name: '',
        description: '',
        creditAmount: 0,
        debitAmount: 0,
        refAccountId: '',
        accountGroupName: ''
      }
    },

    payload: {
      voucherNo: '',
      issueDate: '',
      notifyParty: false,
      internalNotes: '',
      debitTotalAmount: '',
      creditTotalAmount: '',
      billFinalAmount: ''
    },

    showNotes: false,
    companyId: cookie.load(CONSTANTS.COMPANY_ID),
    userId: cookie.load(CONSTANTS.I_USER_ID),
    verifiedBy: {},
    addVoucherValidations: {},
    verifiedByIndex: 0,
    addPayload: {
      narration: ''
    },
    tempJournalsIndex: 1,
    accountNames: null,
    accountNameSuggestions: []
  };

  componentDidMount() {
    let tempDate = new Date();
    let formattedDate = formatDate(tempDate);

    setValidationRules(FormValidationRules);

    this.setState({
      issueDateObj: tempDate,
      payload: {
        ...this.state.payload,
        issueDate: formattedDate
      }
    });

    const companyAccessToken = cookie.load(`${this.state.userId}@${this.state.companyId}`);
    const ACCOUNTS_GET_URL = `${CONSTANTS.API_URL}/i-companies/${this.state.companyId}/accounts`;
    if (companyAccessToken) {
      axios.defaults.headers.common['authorization'] = companyAccessToken || '';
      axios
        .get(ACCOUNTS_GET_URL)
        .then(response => response.data)
        .then(response => {
          this.setState(
            {
              accountNames: response
            },
            this.populateAccountsSuggestion
          );
        })
        .catch(error => console.log(error));
    }
  }

  handleSaveButton() {
    this.props.createJournalVoucher(this.state.payload).then(response => {
      this.props.updateVoucherTypes(!this.props.voucherTypesUpdateState);
      this.props.voucherCloseClick();
      this.props.updateVoucherList();
    });
  }

  validateFormFields() {
    const { payload: { voucherNo } } = this.state;

    let validatorFlag = true;
    validatorFlag &= validate(this, 'voucherNo', voucherNo, 'addVoucherValidations');
    return validatorFlag;
  }

  populateAccountsSuggestion() {
    const value = _.map(this.state.accountNames, items => items.name);
    this.setState({
      accountNameSuggestions: [...value]
    });
  }

  setRefIdTotempJournals() {
    const selectedAccounts = _.filter(
      this.state.accountNames,
      items => items.name === this.state.tempJournals[this.state.currentItemIndex].name
    );
    if (selectedAccounts.length > 0) {
      let tempObj = selectedAccounts[0];
      this.setState({
        tempJournals: {
          ...this.state.tempJournals,
          [this.state.currentItemIndex]: {
            ...this.state.tempJournals[this.state.currentItemIndex],
            refAccountId: tempObj.id,
            accountGroupName: tempObj.accountGroupName,
            refPath: tempObj.path
          }
        }
      });
    }
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

  calTotalCreditDebit() {
    let creditVal = _.map(this.state.tempJournals, item => parseFloat(item.creditAmount));
    let debitVal = _.map(this.state.tempJournals, item => parseFloat(item.debitAmount));

    let totalCredit = creditVal.reduce((currVal, preVal) => currVal + preVal);
    let totalDebit = debitVal.reduce((currVal, preVal) => currVal + preVal);

    this.setState({
      payload: {
        ...this.state.payload,
        creditTotalAmount: totalCredit,
        debitTotalAmount: totalDebit,
        billFinalAmount: totalDebit
      }
    });
  }

  render() {
    const { openAddDrawer, voucherCloseClick } = this.props;

    return (
      <Drawer width="50%" docked={false} open={openAddDrawer} openSecondary={true}>
        <ListHeader
          type="title"
          icon={Cancel}
          to="#"
          replace
          imgWidth="15px"
          imgHeight="15px"
          title="Add Journal"
          onClick={voucherCloseClick}
        />

        <Form>
          <FormRow type="firstRow">
            <FormBlock width="100%">
              <FormBlockTitle>Journal Details</FormBlockTitle>
              <Fields type="secondRow">
                <HorizontalBlock type="withErrors">
                  <TextInputField
                    width="160px"
                    labelSize="2%"
                    labelText="Journal No"
                    value={this.state.payload.voucherNo}
                    errorText={
                      this.state.addVoucherValidations.voucherNo &&
                      !this.state.addVoucherValidations.voucherNo.isValid
                        ? this.state.addVoucherValidations.voucherNo.message
                        : ''
                    }
                    onBlur={() =>
                      validate(
                        this,
                        'voucherNo',
                        this.state.payload.voucherNo,
                        'addVoucherValidations'
                      )
                    }
                    onChange={value => {
                      this.setState({
                        payload: {
                          ...this.state.payload,
                          voucherNo: value.toUpperCase() || ''
                        }
                      });
                    }}
                  />

                  <DateTime
                    hint="Date"
                    width="160px"
                    labelText="Issue Date"
                    value={this.state.issueDateObj}
                    onChange={date => {
                      let tempDate = formatDate(date);

                      this.setState({
                        issueDateObj: date,
                        payload: {
                          ...this.state.payload,
                          issueDate: tempDate
                        }
                      });
                    }}
                  />
                </HorizontalBlock>
              </Fields>
            </FormBlock>
          </FormRow>

          <FormRow type="secondRow">
            <FormBlock width="100%">
              <FormBlockTitle>Journals</FormBlockTitle>

              <FieldsContainer>
                <HorizontalFields type="header">
                  <ItemHeader width="25%">Account</ItemHeader>
                  <ItemHeader width="25%">Description</ItemHeader>
                  <ItemHeader width="25%">Credit</ItemHeader>
                  <ItemHeader width="22%">Debit</ItemHeader>
                </HorizontalFields>

                {_.map(this.state.tempJournals, (item, key) => (
                  <HorizontalFields key={key} type="spaceBetween">
                    <ItemAutoComplete
                      width="25%"
                      height="30px"
                      hint="Account Name"
                      id={`name${key}`}
                      dataSource={this.state.accountNameSuggestions}
                      searchText={this.state.tempJournals[key].name}
                      onFocus={() => this.setState({ currentItemIndex: key })}
                      onUpdateInput={input => {
                        this.setState(
                          {
                            tempJournals: {
                              ...this.state.tempJournals,
                              [key]: {
                                ...this.state.tempJournals[key],
                                name: input
                              }
                            }
                          },
                          this.setRefIdTotempJournals
                        );
                      }}
                    />

                    <ItemTextInput
                      id={`desc${key}`}
                      hint="Description"
                      containerWidth="25%"
                      containerHeight="30px"
                      value={this.state.tempJournals[key].description}
                      onChange={value => {
                        this.setState({
                          tempJournals: {
                            ...this.state.tempJournals,
                            [key]: {
                              ...this.state.tempJournals[key],
                              description: value
                            }
                          }
                        });
                      }}
                    />

                    <ItemTextInput
                      id={`credit${key}`}
                      hint="Rs. 0.00"
                      containerWidth="25%"
                      containerHeight="30px"
                      value={this.state.tempJournals[key].creditAmount}
                      onChange={value => {
                        this.setState(
                          {
                            tempJournals: {
                              ...this.state.tempJournals,
                              [key]: {
                                ...this.state.tempJournals[key],
                                creditAmount: value
                              }
                            }
                          },
                          this.calTotalCreditDebit
                        );
                      }}
                    />

                    <ItemTextInput
                      id={`debit${key}`}
                      hint="Rs. 0.00"
                      containerWidth="25%"
                      containerHeight="30px"
                      errorText={
                        this.state.tempJournals[key].creditAmount <
                        this.state.tempJournals[key].debitAmount
                          ? `Debit can't be larger than credit`
                          : ''
                      }
                      value={this.state.tempJournals[key].debitAmount}
                      onChange={value => {
                        this.setState(
                          {
                            tempJournals: {
                              ...this.state.tempJournals,
                              [key]: {
                                ...this.state.tempJournals[key],
                                debitAmount: value
                              }
                            }
                          },
                          this.calTotalCreditDebit
                        );
                      }}
                    />
                    <ItemHeader width="3%" type="icon" container="icon">
                      <StyledImg
                        src={DeleteIcon}
                        height="14px"
                        weight="14px"
                        disable={
                          Object.keys(this.state.tempJournals).length === 1 ? 'true' : 'false'
                        }
                        onClick={() => {
                          if (Object.keys(this.state.tempJournals).length > 1) {
                            this.setState(
                              {
                                tempJournals: _.omit(this.state.tempJournals, key)
                              },
                              () => {
                                this.calculateSummary();
                                this.calculateTaxBreakup();
                              }
                            );
                          }
                        }}
                      />
                    </ItemHeader>
                  </HorizontalFields>
                ))}
                <HorizontalFields>
                  <SubFields>
                    <AddItemText
                      type="addLine"
                      onClick={() => {
                        this.setState({
                          tempJournals: {
                            ...this.state.tempJournals,
                            [this.state.tempJournalsIndex + 1]: {
                              name: '',
                              debitAmount: 0,
                              description: '',
                              creditAmount: 0,
                              refAccountId: '',
                              accountGroupName: ''
                            }
                          },
                          tempJournalsIndex: this.state.tempJournalsIndex + 1
                        });
                      }}
                    >
                      Add Line +
                    </AddItemText>

                    <SubTotalFeilds>
                      <ItemTextInput
                        id={'totalCredit'}
                        lableFixed={true}
                        underline={false}
                        containerWidth="40%"
                        containerHeight="60px"
                        value={
                          this.state.payload.creditTotalAmount !== ''
                            ? `Rs ${this.state.payload.creditTotalAmount}`
                            : 'Rs 0.00'
                        }
                        readOnly={true}
                      />

                      <ItemTextInput
                        id={'totalDebit'}
                        underline={false}
                        lableFixed={true}
                        containerWidth="40%"
                        containerHeight="60px"
                        value={
                          this.state.payload.debitTotalAmount !== ''
                            ? `Rs ${this.state.payload.debitTotalAmount}`
                            : 'Rs 0.00'
                        }
                        readOnly={true}
                      />
                    </SubTotalFeilds>
                  </SubFields>
                </HorizontalFields>

                <HorizontalFields>
                  <ItemTextInput
                    field="name"
                    id="narration"
                    hint="Narration"
                    containerHeight="30px"
                    containerWidth="calc(60% - 30px)"
                    value={this.state.addPayload.narration}
                    onChange={value => {
                      this.setState({
                        addPayload: {
                          ...this.state.payload,
                          narration: value
                        }
                      });
                    }}
                  />
                </HorizontalFields>
              </FieldsContainer>
            </FormBlock>
          </FormRow>

          <FormRow type="thridRow">
            <FormBlock width="60%">
              <FormBlockTitle>For Internal Use</FormBlockTitle>
              <Fields>
                <SummaryBlock
                  marginBottom="0px"
                  paddingTop="30px"
                  height="unset"
                  alingItems="flex-start"
                >
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
                    <VerifiedByList flexDirection="row" alignItems="center" justifyContent="center">
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
              </Fields>
            </FormBlock>

            <FormBlock width="40%">
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
                          value={this.state.payload.internalNotes}
                          onChange={value => {
                            this.setState({
                              payload: {
                                ...this.state.payload,
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
              iconStyle={{ fill: '#bbbbbc' }}
              checked={this.state.payload.notifyParty}
              labelStyle={{
                fontSize: '14px',
                color: '#bbbbbc',
                fontFamily: 'Dax Regular'
              }}
              onCheck={() => {
                this.setState({
                  payload: {
                    ...this.state.payload,
                    notifyParty: !this.state.payload.notifyParty
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
                  if (this.validateFormFields()) {
                    this.setState(
                      {
                        payload: {
                          ...this.state.payload,
                          accountList: objectToArray(this.state.tempJournals),
                          verifiedBy: objectToArray(this.state.verifiedBy),
                          narration: this.state.addPayload.narration
                        }
                      },
                      this.handleSaveButton
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

const mapStateToProps = ({ teamMembersData, voucherTypesUpdateState }) => ({
  teamMembersData,
  voucherTypesUpdateState
});
export default connect(mapStateToProps, { updateVoucherTypes, createJournalVoucher })(
  AddJournalContainer
);
