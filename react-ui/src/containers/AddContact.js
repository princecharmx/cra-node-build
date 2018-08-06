import React, { Component } from 'react';
import { connect } from 'react-redux';
import { geocodeByAddress } from 'react-places-autocomplete';
import { Drawer } from 'material-ui/';
import filter from 'lodash/filter';
import omit from 'lodash/omit';

import { Cancel } from '../images';
import { ListHeader } from '../containers';
import { Container } from '../components/Contacts/AddContacts/Styles';
import {
  storeBusinessAccounts,
  drawerOpenAddContact,
  nameCheckformPhone,
  updateContactName,
  addContactSave
} from '../actions';
import { getAddContactToggleState } from '../reducers';
import { AddBusiness, AddBusniessDetailsTabs } from '../components/Contacts/AddContacts';
import { setValidationRules, validate, objectToArray, formatDate } from '../utils';
import * as CONSTANTS from '../constants';
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

class AddContact extends Component {
  state = {
    showSave: false,
    payload: {
      businessData: {
        aliasName: '',
        name: '',
        industry: '',
        gstBusinessType: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        gstin: '',
        pancard: ''
      },
      shipping: [],
      primaryContactData: {
        name: '',
        phone: '',
        email: ''
      },
      secondaryContactData: [],
      accountData: {
        isDebit: false,
        balance: '0',
        balanceDate: ''
      },
      notifyContact: false
    },
    tempShippingData: {
      0: {
        address: '',
        pincode: '',
        city: '',
        state: ''
      }
    },
    addressCheck: false,
    tempContactData: {},
    similarName: null,
    similarPhone: null,
    similarPhoneId: null,
    contactDataIndex: 0,
    dateObj: new Date(),
    formValidations: {},
    updatedNameSuccess: false,
    tempShippingDataIndex: 0,
    tabValue: 'Contacts'
  };

  handleTabChange = value => {
    this.setState(_ => ({ tabValue: value }));
  };

  //this function is handels the  onClick in next button
  // it takes value as tabValue i.e is current value of tab,
  // a array of tab is defined, next will have value on which next click will go
  //showSave will render save button if its true
  handleTabNextChange = value => {
    const tabs = [CONSTANTS.CONTACTS, CONSTANTS.BILLING, CONSTANTS.SHIPPING];
    let next;
    tabs.forEach((ele, i) => {
      if (value === ele && i < tabs.length - 1) {
        next = tabs[i + 1];
        return next;
      }
    });
    this.setState(_ => ({
      tabValue: next ? next : tabs[tabs.length - 1],
      showSave: next && next !== tabs[tabs.length - 1] ? false : true
    }));
  };
  componentDidMount() {
    // set default date
    this.setDefaultDate();

    // set validation rules
    setValidationRules(formValidationRules);
  }

  checkForName(phone) {
    const { name: similarName, phone: similarPhone, id } = this.props.checkForName;
    this.props.nameCheckformPhone(phone);

    this.setState({
      similarName: similarName || null,
      similarPhone: similarPhone || null,
      similarPhoneId: id || null
    });
  }

  updateContactName() {
    const { similarPhoneId: id, payload: { primaryContactData: { name } } } = this.state;
    this.props.updateContactName(id, name);
  }

  handleAddContact() {
    const { payload } = this.state;
    this.props.addContactSave(payload);

    if (
      this.props.contacts.contactList &&
      this.props.contacts.loadingContactList === false &&
      this.props.contacts.status === 'success'
    ) {
      //this.props.getContacts();
      this.resetToDefaultState();
      this.setDefaultDate();
    }
    if (
      this.props.contacts.contactList &&
      this.props.contacts.loadingContactList === false &&
      this.props.contacts.status === 'failure'
    ) {
      alert(
        this.props.contacts.error
          ? this.props.contacts.error.response.data.error.message
          : 'something went wrong pls try again'
      );
    }
  }

  setDefaultDate() {
    const tempDate = new Date();
    const formattedDate = formatDate(tempDate);

    this.setState({
      balanceDateObj: tempDate,
      payload: {
        ...this.state.payload,
        accountData: {
          ...this.state.payload.accountData,
          balanceDate: formattedDate
        }
      }
    });
  }

  geocodeByAddress(postalCode) {
    if (postalCode !== '') {
      geocodeByAddress(postalCode.toString()).then(places => {
        let address = places[0].address_components.reverse();
        let filteredData = filter(
          address,
          item =>
            item.types[0] === 'administrative_area_level_1' ||
            item.types[0] === 'administrative_area_level_2' ||
            item.types[0] === 'locality'
        );

        this.setState({
          payload: {
            ...this.state.payload,
            businessData: {
              ...this.state.payload.businessData,
              city: filteredData[1].short_name,
              state: filteredData[0].short_name
            }
          }
        });
      });
    }
  }

  checkForFormValidation() {
    const { payload: { businessData, primaryContactData, accountData } } = this.state;

    let validatorFlag = true;

    validatorFlag &= validate(this, 'name', businessData.name, 'formValidations');
    validatorFlag &= validate(this, 'contactName', primaryContactData.name, 'formValidations');
    validatorFlag &= validate(this, 'phone', primaryContactData.phone, 'formValidations');
    validatorFlag &= validate(this, 'balance', accountData.balance, 'formValidations');

    return validatorFlag;
  }

  updatePayload(key, field, value) {
    this.setState({
      payload: {
        ...this.state.payload,
        [key]: {
          ...this.state.payload[key],
          [field]: value
        }
      }
    });
  }

  handleChanges(name, switchKey, value) {
    let key = '';

    switch (switchKey) {
      case 'businessData':
        key = 'businessData';
        break;
      case 'pincode':
        key = 'businessData';
        break;
      case 'accountData':
        key = 'accountData';
        break;
      default:
        key = '';
        break;
    }

    if (key !== '') {
      this.updatePayload(key, name, value);
    }
  }

  resetToDefaultState() {
    this.setState({
      payload: {
        businessData: {
          aliasName: '',
          name: '',
          industry: '',
          gstBusinessType: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          gstin: '',
          pancard: ''
        },
        primaryContactData: {
          name: '',
          phone: '',
          email: ''
        },
        secondaryContactData: [],
        accountData: {
          isDebit: true,
          balance: '',
          balanceDate: ''
        },
        notifyContact: false
      },
      tempContactData: {},
      contactDataIndex: 0,
      addressCheck: false,
      similarName: null,
      similarPhone: null,
      similarPhoneId: null,
      updatedNameSuccess: false,
      formValidations: {},
      tempShippingData: {
        address: '',
        pincode: '',
        state: '',
        city: ''
      }
    });
  }
  autoPopulateShippingAddressfeilds() {
    const addressCheck = this.state.addressCheck;
    if (addressCheck) {
      this.setState({
        tempShippingData: {
          0: {
            address: this.state.payload.businessData.address,
            pincode: this.state.payload.businessData.pincode,
            city: this.state.payload.businessData.city,
            state: this.state.payload.businessData.state
          }
        }
      });
    }
  }

  render() {
    return (
      <Drawer
        width="45%"
        docked={false}
        id="addContact"
        openSecondary={true}
        open={this.props.hideDrawer}
        onRequestChange={(open, escape) => this.props.drawerOpenAddContact()}
      >
        <ListHeader
          title="Add Party"
          icon={Cancel}
          to="#"
          onClick={this.props.drawerOpenAddContact}
        />
        <Container>
          <AddBusiness
            {...this.state}
            onBlurData={(event, name) =>
              validate(this, name, event.target.value, 'formValidations')
            }
            onChangeBusinessData={(value, name, field) => this.handleChanges(name, field, value)}
            onChangeAccountData={value => {
              const regex = /^[0-9]+$/;
              if (value === '' || regex.test(value)) {
                this.setState({
                  payload: {
                    ...this.state.payload,
                    accountData: {
                      ...this.state.payload.accountData,
                      balance: value
                    }
                  }
                });
              }
            }}
            toggleIsDebit={() => {
              this.setState({
                payload: {
                  ...this.state.payload,
                  accountData: {
                    ...this.state.payload.accountData,
                    isDebit: !this.state.payload.accountData.isDebit
                  }
                }
              });
            }}
            onChangeDate={date => {
              let tempDate = formatDate(date);
              this.setState({
                balanceDateObj: date,
                payload: {
                  ...this.state.payload,
                  accountData: {
                    ...this.state.payload.accountData,
                    balanceDate: tempDate
                  }
                }
              });
            }}
          />

          <AddBusniessDetailsTabs
            {...this.state}
            handleTabChange={this.handleTabChange}
            handleTabNextChange={this.handleTabNextChange}
            onBlurTabs={(event, name) =>
              validate(this, name, event.target.value, 'formValidations')
            }
            onChangeContactName={value =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  primaryContactData: {
                    ...this.state.payload.primaryContactData,
                    name: value
                  }
                }
              })
            }
            onBlurPhoneField={event => {
              validate(this, 'phone', event.target.value, 'formValidations');
              this.checkForName(event.target.value);
            }}
            onChangeEmail={value => {
              this.setState({
                payload: {
                  ...this.state.payload,
                  primaryContactData: {
                    ...this.state.payload.primaryContactData,
                    email: value
                  }
                }
              });
            }}
            onFocusTempContactData={index =>
              this.setState({
                contactDataIndex: index
              })
            }
            onChangeTempContactData={(value, index) => {
              this.setState({
                tempContactData: {
                  ...this.state.tempContactData,
                  [index]: {
                    ...this.state.tempContactData[index],
                    name: value
                  }
                }
              });
            }}
            onChangeMobileNo={(value, index) => {
              let tempVal = parseInt(value, 10) || '';
              this.setState({
                tempContactData: {
                  ...this.state.tempContactData,
                  [index]: {
                    ...this.state.tempContactData[index],
                    phone: tempVal
                  }
                }
              });
            }}
            onChangeTempContactDataEmail={(value, index) => {
              this.setState({
                tempContactData: {
                  ...this.state.tempContactData,
                  [index]: {
                    ...this.state.tempContactData[index],
                    email: value
                  }
                }
              });
            }}
            deleteTempContactData={index =>
              this.setState({
                tempContactData: omit(this.state.tempContactData, index)
              })
            }
            addSecondaryContactData={() => {
              this.setState({
                tempContactData: {
                  ...this.state.tempContactData,
                  [this.state.contactDataIndex + 1]: {
                    phone: '',
                    name: '',
                    email: ''
                  }
                },
                contactDataIndex: this.state.contactDataIndex + 1
              });
            }}
            onBlurBillingDetailsAddress={() => {
              validate(this, 'address', this.state.payload.businessData.address, 'formValidations');
              this.geocodeByAddress(this.state.payload.businessData.pincode);
            }}
            onChangeContactDataPhone={value => {
              let tempVal = parseInt(value, 10) || '';
              this.setState({
                payload: {
                  ...this.state.payload,
                  primaryContactData: {
                    ...this.state.payload.primaryContactData,
                    phone: tempVal
                  }
                }
              });
            }}
            updateContactName={() => this.updateContactName()}
            updateName={() =>
              this.setState({
                payload: {
                  ...this.state.payload,
                  primaryContactData: {
                    ...this.state.payload.primaryContactData,
                    name: this.state.similarName
                  }
                }
              })
            }
            handleChanges={(value, name) => this.handleChanges(name, 'businessData', value)}
            onBlurPincode={() => {
              validate(this, 'pincode', this.state.payload.businessData.pincode, 'formValidations');
              this.geocodeByAddress(this.state.payload.businessData.pincode);
            }}
            onBlurCity={() => {
              validate(this, 'city', this.state.payload.businessData.city, 'formValidations');
              this.geocodeByAddress(this.state.payload.businessData.city);
            }}
            onBlurState={() => {
              validate(this, 'state', this.state.payload.businessData.state, 'formValidations');
              this.geocodeByAddress(this.state.payload.businessData.city);
            }}
            onCheckSameShippingAddress={() =>
              this.setState(
                { addressCheck: !this.state.addressCheck },
                this.autoPopulateShippingAddressfeilds
              )
            }
            setAddShippingIndex={index => {
              this.setState({
                tempShippingDataIndex: index
              });
            }}
            updateShippingAddress={(value, index) => {
              this.setState({
                tempShippingData: {
                  ...this.state.tempShippingData,
                  [index]: {
                    ...this.state.tempShippingData[index],
                    address: value
                  }
                }
              });
            }}
            updateShippingAddressPincode={(value, index) => {
              let tempVal = parseInt(value, 10) || '';
              this.setState({
                tempShippingData: {
                  ...this.state.tempShippingData,
                  [index]: {
                    ...this.state.tempShippingData[index],
                    pincode: tempVal
                  }
                }
              });
            }}
            updateShippingAddressCity={(value, index) => {
              this.setState({
                tempShippingData: {
                  ...this.state.tempShippingData,
                  [index]: {
                    ...this.state.tempShippingData[index],
                    city: value
                  }
                }
              });
            }}
            updateShipppingAddressState={(value, index) => {
              this.setState({
                tempShippingData: {
                  ...this.state.tempShippingData,
                  [index]: {
                    ...this.state.tempShippingData[index],
                    state: value
                  }
                }
              });
            }}
            deleteTempShippingData={index => {
              this.setState({
                tempShippingData: omit(this.state.tempShippingData, index)
              });
            }}
            addAnotherShippingDetails={() => {
              this.setState({
                tempShippingData: {
                  ...this.state.tempShippingData,
                  [this.state.tempShippingDataIndex + 1]: {
                    address: '',
                    pincode: '',
                    city: '',
                    state: ''
                  }
                },
                tempShippingDataIndex: this.state.tempShippingDataIndex + 1
              });
            }}
            toggleNotifyContact={() => {
              this.setState({
                payload: {
                  ...this.state.payload,
                  notifyContact: !this.state.payload.notifyContact
                }
              });
            }}
            handleSaveButton={() => {
              if (this.checkForFormValidation()) {
                this.setState(
                  {
                    payload: {
                      ...this.state.payload,
                      secondaryContactData: objectToArray(this.state.tempContactData),
                      shipping:
                        this.state.tempShippingData[0].address === '' &&
                        this.state.tempShippingData[0].city === '' &&
                        this.state.tempShippingData[0].state === '' &&
                        this.state.tempShippingData[0].pincode === ''
                          ? []
                          : objectToArray(this.state.tempShippingData)
                    }
                  },
                  this.handleAddContact
                );
              }
            }}
          />
        </Container>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  const { contacts, checkForName, updateContactName } = state;
  return {
    contacts,
    checkForName,
    updateContactName,
    hideDrawer: getAddContactToggleState(state)
  };
};
export default connect(mapStateToProps, {
  storeBusinessAccounts,
  nameCheckformPhone,
  updateContactName,
  drawerOpenAddContact,
  addContactSave
})(AddContact);
