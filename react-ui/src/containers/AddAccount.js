import axios from 'axios';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { Drawer } from 'material-ui/';

import { ListHeader } from '../containers';
import * as CONSTANTS from '../constants';
import { storeBusinessAccounts } from '../actions';
import { setValidationRules, formatDate } from '../utils';
import { Button, TextInputField, DateTime, Toggle, AutoFillInput } from '../components';
import { Cancel, HandShake, Gstin } from '../images';

const Container = styled.div`
  height: calc(100% - 61px);
  overflow-y: scroll;
`;

const Fields = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${p => {
    switch (p.type) {
      case 'LeftPadding':
        return '15px 30px 15px 30px';
      case 'TopPadding':
        return '40px 30px 0px 15px';
      default:
        return '30px 30px 0px 30px';
    }
  }};
`;

const HorizontalFields = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 35px 30px 0px 30px;
  justify-content: space-between;
`;

const Label = styled.label`
  display: table;
  margin: auto;
  color: #428bca;
  padding-top: 15px;
  padding-right: 10px;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  margin: 30px 0px 30px 0px;
`;

const formValidationRules = {
  contactName: ['notEmpty', 'minLength2', 'onlyWords'],
  name: ['notEmpty', 'minLength2', 'onlyWords'],
  phone: ['notEmpty', 'minLength10'],
  balance: ['notEmpty'],
  pincode: ['pincode', 'notEmpty'],
  city: ['notEmpty'],
  state: ['notEmpty'],
  address: ['notEmpty']
};

class AddAccount extends Component {
  constructor() {
    super();

    this.state = {
      companyId: cookie.load(CONSTANTS.COMPANY_ID),
      iUserId: cookie.load(CONSTANTS.I_USER_ID),
      payload: {
        name: '',
        balance: 0,
        balanceDate: '',
        description: '',
        accountGroupName: ''
      },
      addressCheck: false,
      businessAccountsSuggestions: ['Expences', 'Purchase'],
      tempContactData: {},
      contactDataIndex: 0,
      dateObj: new Date(),
      formValidations: {},
      updatedNameSuccess: false,
      tempShippingDataIndex: 0,
      alreadyExistNameAndPhone: {}
    };
  }
  componentDidMount() {
    // set default date
    this.setDefaultDate();

    // set validation rules
    setValidationRules(formValidationRules);
  }

  handleAddAccount = () => {
    const URL = `${CONSTANTS.API_URL}/i-companies/${cookie.load(CONSTANTS.COMPANY_ID)}/accounts`;

    axios
      .post(URL, this.state.payload)
      .then(response => response.data)
      .then(data => {
        this.props.drawerClose();
        this.props.getAccounts();
        this.resetToDefaultState();
        this.setDefaultDate();
      })
      .catch(error =>
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.message
            : 'something went wrong pls try again'
        )
      );
  };

  resetToDefaultState() {
    this.setState({
      payload: {
        name: '',
        balance: 0,
        balanceDate: '',
        description: '',
        accountGroupName: ''
      },
      accountGroupName: ['Purchase', 'Expense'],
      addressCheck: false,
      tempContactData: {},
      contactDataIndex: 0,
      dateObj: new Date(),
      formValidations: {},
      updatedNameSuccess: false,
      tempShippingDataIndex: 0,
      alreadyExistNameAndPhone: {}
    });
  }

  setDefaultDate() {
    let tempDate = new Date();
    let formattedDate = formatDate(tempDate);

    this.setState({
      balanceDateObj: tempDate,
      payload: {
        ...this.state.payload,
        balanceDate: formattedDate
      }
    });
  }

  render() {
    return (
      <Drawer
        width="45%"
        docked={false}
        id="AddAccount"
        openSecondary={true}
        open={this.props.openAddAccount}
        onRequestChange={(open, escape) => this.props.drawerClose()}
      >
        <ListHeader title="Add Account" icon={Cancel} to="#" onClick={this.props.drawerClose} />

        <Container>
          <Fields>
            {/* remove reqired feild */}
            <TextInputField
              id="businessDataName"
              width="230px"
              labelSize="2px"
              imgSrc={HandShake}
              value={this.state.payload.name}
              labelText="Account Name"
              // errorText={
              //   this.state.formValidations.name && !this.state.formValidations.name.isValid
              //     ? this.state.formValidations.name.message
              //     : ''
              // }
              //onBlur={event => validate(this, 'name', event.target.value, 'formValidations')}
              onChange={value =>
                this.setState({
                  payload: {
                    ...this.state.payload,
                    name: value
                  }
                })
              }
            />

            <AutoFillInput
              width="200px"
              labelText="User Group"
              searchText={this.state.searchText}
              dataSource={this.state.businessAccountsSuggestions}
              onUpdateInput={input =>
                this.setState({
                  searchText: input,
                  payload: {
                    ...this.state.payload,
                    accountGroupName: input
                  }
                })
              }
            />
          </Fields>

          <HorizontalFields>
            <TextInputField
              hint="200"
              width="180px"
              labelSize="2%"
              imgSrc={Gstin}
              labelText="Balance"
              value={this.state.payload.balance}
              onChange={value =>
                this.setState({
                  payload: {
                    ...this.state.payload,
                    balance: value
                  }
                })
              }
            />

            <Toggle
              id="creditDebitToggle"
              //checked={this.state.payload.accountData.isDebit}
              // onClick={() => {
              //   this.setState({
              //     payload: {
              //       ...this.state.payload,
              //       accountData: {
              //         ...this.state.payload.accountData,
              //         isDebit: !this.state.payload.accountData.isDebit
              //       }
              //     }
              //   });
              // }}
            />

            <div style={{ display: 'flex' }}>
              <Label>as of</Label>
              <DateTime
                width="100px"
                underline={false}
                marginOnTop="15px"
                id="balanceDateObj"
                value={this.state.balanceDateObj}
                onChange={date => {
                  let tempDate = formatDate(date);
                  this.setState({
                    ...this.state.payload,
                    balanceDate: tempDate
                  });
                }}
              />
            </div>
          </HorizontalFields>
          <Footer>
            <Button to="#" margintop="20px" onClick={this.handleAddAccount}>
              Save
            </Button>
          </Footer>
        </Container>
      </Drawer>
    );
  }
}

export default connect(null, { storeBusinessAccounts })(AddAccount);
