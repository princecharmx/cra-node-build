import React from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import {
  Gst,
  City,
  State,
  Gstin,
  Pincode,
  HandShake,
  DeleteIcon,
  ContactsLogo
} from '../../../images/index';
import { TextInputField, ImageHolder, Dropdown, Button } from '../../index';
import { Checkbox, MenuItem, Tab, Tabs, Divider } from 'material-ui/';
import {
  Row,
  Card,
  Fields,
  Footer,
  Message,
  DeleteBox,
  MessageBox,
  FormBlockTitle,
  TabsBackground,
  SecondaryContacts,
  SecondaryContactsContainer
} from './Styles';
import * as CONSTANTS from '../../../constants';

const SecondaryContactsButton = ({
  parimaryContact,
  contactDataCount,
  tempContactData,
  addSecondaryContactData
}) => {
  const primaryNotEmpty = parimaryContact.name !== '' && parimaryContact.phone !== '';
  const extraContactLength = Object.keys(tempContactData).length;
  const extraContactNotEmpty =
    extraContactLength > 0 && tempContactData[contactDataCount].name
      ? tempContactData[contactDataCount].name !== ''
      : false;

  if (primaryNotEmpty && extraContactLength === 0) {
    return (
      <SecondaryContacts
        tabIndex="0"
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addSecondaryContactData();
          }
        }}
        onClick={() => {
          addSecondaryContactData();
        }}
      >
        Add Secondary Contacts +
      </SecondaryContacts>
    );
  }

  if (extraContactLength > 0 && extraContactNotEmpty) {
    return (
      <SecondaryContacts
        tabIndex="0"
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addSecondaryContactData();
          }
        }}
        onClick={() => {
          addSecondaryContactData();
        }}
      >
        Add Secondary Contacts +
      </SecondaryContacts>
    );
  }
  return null;
};

const AddtionalDetailsTabs = ({
  tabValue,
  showSave,
  handleTabChange,
  handleTabNextChange,
  payload,
  onBlurTabs,
  updateName,
  onBlurCity,
  onBlurState,
  similarName,
  handleChanges,
  onChangeEmail,
  onBlurPincode,
  formValidations,
  tempContactData,
  contactDataIndex: contactDataCount,
  onBlurPhoneField,
  onChangeMobileNo,
  tempShippingData,
  handleSaveButton,
  updateContactName,
  updatedNameSuccess,
  toggleNotifyContact,
  setAddShippingIndex,
  onChangeContactName,
  deleteTempContactData,
  updateShippingAddress,
  onFocusTempContactData,
  deleteTempShippingData,
  onChangeTempContactData,
  addSecondaryContactData,
  onChangeContactDataPhone,
  updateShippingAddressCity,
  addAnotherShippingDetails,
  onCheckSameShippingAddress,
  updateShipppingAddressState,
  onBlurBillingDetailsAddress,
  onChangeTempContactDataEmail,
  updateShippingAddressPincode
}) => {
  return (
    <TabsBackground>
      <Tabs
        tabItemContainerStyle={{
          backgroundColor: '#f5f5f5',
          width: '257px',
          height: '30px',
          alignItems: 'center',
          marginLeft: '30px'
        }}
        inkBarStyle={{ background: '#b4b4b4', marginLeft: '30px' }}
        value={tabValue}
        onChange={handleTabChange}
      >
        <Tab
          style={{ color: '#b4b4b4' }}
          label={CONSTANTS.CONTACTS}
          value={CONSTANTS.CONTACTS}
          id="1"
        >
          <Fields type="LeftPadding">
            <TextInputField
              id="contactDataName"
              width="230px"
              hint="Invock"
              labelSize="2%"
              imgSrc={ContactsLogo}
              labelText="Contact Name*"
              errorText={
                formValidations.contactName && !formValidations.contactName.isValid
                  ? formValidations.contactName.message
                  : ''
              }
              value={payload.primaryContactData.name}
              onBlur={event => {
                onBlurTabs(event, 'contactName');
              }}
              onChange={value => onChangeContactName(value)}
            />

            <TextInputField
              width="230px"
              hint="Invock"
              labelSize="2%"
              imgSrc={Pincode}
              id="contactDataPhone"
              labelText="Contact Mobile*"
              errorText={
                formValidations.phone && !formValidations.phone.isValid
                  ? formValidations.phone.message
                  : !updatedNameSuccess &&
                    similarName &&
                    similarName !== payload.primaryContactData.name &&
                    `This number already exists as ${similarName}`
              }
              value={payload.primaryContactData.phone}
              onBlur={event => onBlurPhoneField(event)}
              onChange={value => onChangeContactDataPhone(value)}
            />
          </Fields>

          {!updatedNameSuccess &&
            similarName &&
            similarName !== payload.primaryContactData.name && (
              <Row>
                <Card>
                  <MessageBox bgcolor="#f5f5f5">
                    <Message padding="leftright" color="#868686">
                      {`Do you want to update ${similarName} to ${
                        payload.primaryContactData.name
                      }?`}
                    </Message>
                  </MessageBox>

                  <MessageBox type="buttons">
                    <Message type="button" color="#428bca" onClick={updateContactName}>
                      Yes
                    </Message>
                    <Message
                      type="button"
                      color="#428bca"
                      onClick={() => {
                        updateName();
                      }}
                    >
                      No
                    </Message>
                  </MessageBox>
                </Card>
              </Row>
            )}

          <Fields type="LeftPadding">
            <TextInputField
              id="contactDataEmail"
              width="230px"
              hint="Invock"
              labelSize="2%"
              imgSrc={Pincode}
              labelText="Email"
              value={payload.primaryContactData.email}
              onChange={value => onChangeEmail(value)}
            />
          </Fields>

          {!isEmpty(tempContactData) && (
            <SecondaryContactsContainer>
              <FormBlockTitle>Secondary Contacts</FormBlockTitle>

              {map(tempContactData, (contactData, index) => (
                <div key={`contacts-${index}`}>
                  <Fields type="LeftPadding">
                    <TextInputField
                      id={`contactName.${index}`}
                      width="230px"
                      hint="Invock"
                      labelSize="2%"
                      imgSrc={ContactsLogo}
                      labelText="Contact Name"
                      value={tempContactData[index].name}
                      onFocus={() => onFocusTempContactData(index)}
                      onChange={value => onChangeTempContactData(value, index)}
                    />
                    <TextInputField
                      id={`contactMobileNo.${index}`}
                      width="230px"
                      hint="Invock"
                      labelSize="2%"
                      imgSrc={Pincode}
                      labelText="Contact Mobile"
                      value={tempContactData[index].phone}
                      onFocus={() => onFocusTempContactData(index)}
                      onChange={value => onChangeMobileNo(value, index)}
                    />
                  </Fields>

                  <Fields type="LeftPadding">
                    <TextInputField
                      id={`contactEmail.${index}`}
                      width="230px"
                      hint="Invock"
                      labelSize="2%"
                      imgSrc={Pincode}
                      labelText="Email"
                      value={tempContactData[index].email}
                      onFocus={() => onFocusTempContactData(index)}
                      onChange={value => {
                        onChangeTempContactDataEmail(value, index);
                      }}
                    />
                    <DeleteBox
                      onClick={() => {
                        deleteTempContactData(index);
                      }}
                    >
                      <ImageHolder src={DeleteIcon} height="14px" weight="14px" disable={'true'} />{' '}
                      Delete
                    </DeleteBox>
                  </Fields>

                  <Divider style={{ marginTop: '15px', backgroundColor: '#e7e7e8' }} />
                </div>
              ))}
            </SecondaryContactsContainer>
          )}

          <SecondaryContactsButton
            contactDataCount={contactDataCount}
            parimaryContact={payload.primaryContactData}
            tempContactData={tempContactData}
            addSecondaryContactData={addSecondaryContactData}
          />
        </Tab>

        <Tab
          style={{ color: '#b4b4b4' }}
          label={`${CONSTANTS.BILLING} *`}
          value={CONSTANTS.BILLING}
          id="2"
        >
          <Fields type="LeftPadding">
            <TextInputField
              id="businessDataAddress"
              width="230px"
              hint="Lower Parel"
              labelSize="2px"
              focusedLabelSize="12px"
              imgSrc={Pincode}
              labelText="Address *"
              errorText={
                formValidations.address && !formValidations.address.isValid
                  ? formValidations.address.message
                  : ''
              }
              onBlur={() => onBlurBillingDetailsAddress()}
              value={payload.businessData.address}
              onChange={value => {
                handleChanges(value, 'address');
              }}
            />

            <TextInputField
              id="businessDataPincode"
              width="230px"
              hint="Invock"
              labelSize="2%"
              imgSrc={Pincode}
              labelText="Pincode *"
              lableSize="20em"
              value={payload.businessData.pincode}
              errorText={
                formValidations.pincode && !formValidations.pincode.isValid
                  ? formValidations.pincode.message
                  : ''
              }
              onBlur={() => onBlurPincode()}
              onChange={value => {
                let tempVal = parseInt(value, 10) || '';
                handleChanges(tempVal, 'pincode');
              }}
            />
          </Fields>

          <Fields type="LeftPadding">
            <TextInputField
              id="businessDataCity"
              width="230px"
              hint="Mumbai"
              labelSize="2%"
              imgSrc={City}
              labelText="City"
              errorText={
                formValidations.city && !formValidations.city.isValid
                  ? formValidations.city.message
                  : ''
              }
              onBlur={() => {
                onBlurCity();
              }}
              value={payload.businessData.city}
              onChange={value => {
                handleChanges(value, 'city');
              }}
            />

            <TextInputField
              id="businessDataState"
              width="230px"
              hint="Maharashtra"
              labelSize="2%"
              imgSrc={State}
              labelText="State"
              errorText={
                formValidations.state && !formValidations.state.isValid
                  ? formValidations.state.message
                  : ''
              }
              onBlur={() => onBlurState()}
              value={payload.businessData.state}
              onChange={value => {
                handleChanges(value, 'state');
              }}
            />
          </Fields>

          <Fields type="LeftPadding">
            <Dropdown
              width="230px"
              labelSize="2%"
              value={payload.businessData.gstBusinessType}
              imgSrc={Gst}
              labelText="Gst Business Type"
              onChange={value => handleChanges(value, 'gstBusinessType')}
            >
              <MenuItem value="Regular GST Business" primaryText="Regular GST Business" />
              <MenuItem value="Composition GST Business" primaryText="Composition GST Business" />
              <MenuItem value="Unregistered Business" primaryText="Unregistered GST" />
            </Dropdown>

            {payload.businessData.gstBusinessType === 'Unregistered Business' ? (
              <TextInputField
                id="businessDataPancard1"
                width="230px"
                hint="AABPS8791R"
                labelSize="2%"
                imgSrc={HandShake}
                value={payload.businessData.pancard}
                onChange={value => {
                  handleChanges(value, 'pancard');
                }}
                labelText="Pancard"
              />
            ) : (
              <TextInputField
                id="businessDataGstin2"
                width="230px"
                hint="22AAAAA0000A1Z5"
                labelSize="2%"
                imgSrc={Gstin}
                labelText="GstIn Number"
                value={payload.businessData.gstin}
                onChange={value => {
                  handleChanges(value.toUpperCase(), 'gstin');
                }}
              />
            )}
          </Fields>
        </Tab>

        <Tab
          style={{ color: '#b4b4b4' }}
          label={CONSTANTS.SHIPPING}
          value={CONSTANTS.SHIPPING}
          id="3"
        >
          <Fields type="LeftPadding">
            <Checkbox
              label="Same as Billing Address"
              labelStyle={{ color: '#bbbbbc' }}
              iconStyle={{ fill: '#bbbbbc' }}
              onCheck={() => onCheckSameShippingAddress()}
            />
          </Fields>

          {map(tempShippingData, (shippingData, index) => (
            <div key={index}>
              <Fields type="LeftPadding">
                <TextInputField
                  id={`shippingDataAddress.${index}`}
                  width="230px"
                  labelSize="2%"
                  imgSrc={ContactsLogo}
                  labelText="Address"
                  value={tempShippingData[index].address}
                  onFocus={() => setAddShippingIndex(index)}
                  onChange={value => updateShippingAddress(value, index)}
                />
                <TextInputField
                  id={`shippingDataPincode.${index}`}
                  width="230px"
                  hint="Invock"
                  labelSize="2%"
                  imgSrc={Pincode}
                  labelText="Pincode"
                  value={tempShippingData[index].pincode}
                  onFocus={() => setAddShippingIndex(index)}
                  onChange={value => {
                    updateShippingAddressPincode(value, index);
                  }}
                />
              </Fields>

              <Fields type="LeftPadding">
                <TextInputField
                  id={`shippingDataCity.${index}`}
                  width="230px"
                  hint="400012"
                  labelSize="2%"
                  imgSrc={Pincode}
                  labelText="City"
                  value={tempShippingData[index].city}
                  onFocus={() => setAddShippingIndex(index)}
                  onChange={value => {
                    updateShippingAddressCity(value, index);
                  }}
                />
                <TextInputField
                  id={`shippingDataPincode.${index}`}
                  width="230px"
                  hint="Delhi"
                  labelSize="2%"
                  imgSrc={Pincode}
                  labelText="State"
                  value={tempShippingData[index].state}
                  onFocus={() => setAddShippingIndex(index)}
                  onChange={value => {
                    updateShipppingAddressState(value, index);
                  }}
                />
              </Fields>

              {index > 0 && (
                <DeleteBox
                  type="padding"
                  onClick={() => {
                    deleteTempShippingData(index);
                  }}
                >
                  <ImageHolder src={DeleteIcon} height="14px" weight="14px" /> Delete
                </DeleteBox>
              )}

              <Divider style={{ marginTop: '15px', backgroundColor: '#e7e7e8' }} />
            </div>
          ))}
          <SecondaryContacts
            onClick={() => {
              addAnotherShippingDetails();
            }}
          >
            Add another Shipping Details +
          </SecondaryContacts>
        </Tab>
      </Tabs>

      <Footer>
        <div style={{ alignItems: 'center', width: '230px' }}>
          <Checkbox
            id="notifyContact"
            label="Notify contact to join Invock"
            style={{ width: '230px' }}
            iconStyle={{ fill: '#bbbbbc' }}
            checked={payload.notifyContact}
            labelStyle={{
              fontSize: '14px',
              fontFamily: 'Dax Regular',
              color: '#bbbbbc'
            }}
            onCheck={() => {
              toggleNotifyContact();
            }}
          />
        </div>

        {tabValue && !showSave ? (
          <Button
            to="#"
            margintop="20px"
            onClick={() => {
              handleTabNextChange(tabValue);
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            to="#"
            margintop="20px"
            onClick={() => {
              handleSaveButton();
            }}
          >
            Save
          </Button>
        )}
      </Footer>
    </TabsBackground>
  );
};

export default AddtionalDetailsTabs;
