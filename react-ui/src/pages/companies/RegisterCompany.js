import cookie from 'react-cookies';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import styled from 'styled-components';
import mixpanel from 'mixpanel-browser';
import React, { Component } from 'react';
import MenuItem from 'material-ui/MenuItem';
import ClevertapReact from 'clevertap-react';
import { Redirect } from 'react-router-dom';
import { geocodeByAddress } from 'react-places-autocomplete';
import filter from 'lodash/filter';
import map from 'lodash/map';

import * as companiesApi from '../../api/companies';

import { setValidationRules, validate } from '../../utils';
import * as CONSTANTS from '../../constants';

import { similarCompanies, registerCompanyPayload, toggleSimilarCompanyCheck } from '../../actions';

import {
  Button,
  Dropdown,
  FlexCenter,
  TextInputField,
  LoaderContainer,
  Loader
} from '../../components';

import {
  Gst,
  City,
  State,
  Gstin,
  Pincode,
  Address,
  Industry,
  HandShake,
  BackArrow,
  CompanyPassword
} from '../../images';

const ContentSection = FlexCenter.extend`
  width: auto;
  height: calc(100vh - 64px);
`;

const ContentContainer = styled.div`
  height: 80vh;
  width: 400px;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

const PageHeader = styled.div`
  height: 60px;
  color: #888888;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-around;
  ${p => p.type === 'button' && `cursor:pointer;`};
  ${p => p.padding === 'true' && `padding:0px 30px 0px 30px;`};
`;

const Fields = styled.div`
  width: 100%;
  display: flex;
  overflow: auto;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  height: calc(80vh - 150px);
  justify-content: flex-start;
`;

const HorizontalFields = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormRow = styled.div`
  ${p =>
    p.type === 'noPadding'
      ? `
    width: 100%;
    padding: 0px;
    display: flex;
    flex-shrink: 0;
    margin-top: 10px;
  `
      : `
    height: 65px;
    display: flex;
    flex-shrink: 0;
    padding: 0px 20px;
    width: calc(100% - 40px);
 `};
`;

const FormValidationRules = {
  name: ['notEmpty'],
  city: ['notEmpty'],
  state: ['notEmpty'],
  pincode: ['pincode'],
  address: ['notEmpty'],
  industry: ['notEmpty'],
  password: ['notEmpty'],
  ifscCode: ['ifscCode'],
  confirmPassword: ['notEmpty'],
  gstBusinessType: ['notEmpty'],
  accountNumber: ['bankAccountNo']
};

const FormBlockTitle = styled.div`
  width: 100%;
  display: flex;
  min-height: 30px;
  text-indent: 30px;
  background: #f5f5f5;
  align-items: center;
  font-family: 'Dax Regular';
  color: ${p => (p.color ? p.color : '#b4b4b4')};
  font-size: ${p => (p.fontSize ? p.fontSize : '15px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '600')};
`;

const StyledImg = styled.img`
  background-color: transparent;
  cursor: pointer;
  width: ${props => (props.imgWidth ? props.imgWidth : '20px')};
  height: ${props => (props.imgHeight ? props.imgHeight : '20px')};
`;

//genric function to updates the this.state.payload.companyData.name value when called this.setState(updateCompanyData('name', value))
let updatePayload = type => (key, value) => state => ({
  payload: {
    ...state.payload,
    [type]: {
      ...state.payload[type],
      [key]: value
    }
  }
});

let updateCompanyData = (key, value) => updatePayload('companyData')(key, value);
let updateBranchData = (key, value) => updatePayload('branchData')(key, value);
//this will be changed once ui gets updated
let updateBankDetails = (key, value) => updatePayload('bankAccount')(key, value);

class RegisterCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //temporay fix to register new company till UI gets updated, remove bankAccout once ui gets updated
      payload: {
        companyData: {
          name: '',
          pancard: '',
          industry: '',
          legalType: '',
          financialYear: ''
        },
        branchData: {
          name: 'Primary Location',
          gstBusinessType: '',
          gstin: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        },
        bankAccount: {
          branch: '',
          ifscCode: '',
          bankName: '',
          accountName: '',
          accountNumber: ''
        },
        password: ''
      },
      userAccessToken: cookie.load('userAccessToken'),
      confirmError: '',
      confirmPassword: '',
      renderBankDetails: false,
      renderCompanyDetails: true,
      renderPasswordDetails: false,
      businessTypes: null,
      registerCompanyValidations: {}
    };
  }

  componentDidMount() {
    // third party event tracking code
    mixpanel.track('register-company-screen');
    ClevertapReact.event('register-company-screen');

    // get gst business types from the API
    this.getGSTBusinessTypes();

    // set validation rules
    setValidationRules(FormValidationRules);
  }

  validateCompanyDetails() {
    const {
      payload: {
        companyData: { name, industry },
        branchData: { city, state, address, pincode, gstBusinessType }
      }
    } = this.state;
    let validFormField = true;
    validFormField &= validate(this, 'industry', industry, 'registerCompanyValidations');
    validFormField &= validate(this, 'name', name, 'registerCompanyValidations');
    validFormField &= validate(this, 'address', address, 'registerCompanyValidations');
    validFormField &= validate(this, 'city', city, 'registerCompanyValidations');
    validFormField &= validate(this, 'state', state, 'registerCompanyValidations');
    validFormField &= validate(this, 'pincode', pincode, 'registerCompanyValidations');
    validFormField &= validate(
      this,
      'gstBusinessType',
      gstBusinessType,
      'registerCompanyValidations'
    );
    return validFormField;
  }

  validatePasswordFields() {
    const { payload: { password }, confirmPassword } = this.state;

    let validFormField = true;
    validFormField &= validate(this, 'password', password, 'registerCompanyValidations');
    validFormField &= validate(
      this,
      'confirmPassword',
      confirmPassword,
      'registerCompanyValidations'
    );

    return validFormField;
  }

  getGSTBusinessTypes() {
    companiesApi.getGSTMaster().then(data => {
      this.setState({ businessTypes: data });
    });
  }

  makePOSTRequest() {
    const { similarCompanyCheck, user: { id } } = this.props;
    const { payload, renderSimilarCompanies } = this.state;
    companiesApi
      .createCompany(id, payload)
      .then(data => {
        // if similarCompanies is not null, then take the user to similarCompanies screen
        if (!isEmpty(data.similarCompanies) && !renderSimilarCompanies && !similarCompanyCheck) {
          // dispatch data to the redux store by calling an action
          this.props.similarCompanies(data.similarCompanies);
          this.props.registerCompanyPayload(this.state.payload);

          this.props.history.replace(`/${this.props.match.params.id}/companies/similar-companies`);
        } else {
          // register the company with the payload the data user provided
          const companyId = data.createdCompany && data.createdCompany.id;
          cookie.save(CONSTANTS.COMPANY_ID, companyId, { path: '/' });
          /**
           * everytime the user tries to login into a new company we will store the
           * company specific accesstoken in 'userId@companyId' format so that the
           * accessToken will be unique everytime
           *
           * this.state.payload.id ➡ userId
           * data.createdCompany.id ➡ comanyId
           */
          data.accessToken &&
            cookie.save(`${data.accessToken.iUserId}@${companyId}`, data.accessToken.id, {
              path: '/'
            });
          // TODO Should be implemented in a centralized routing logic
          this.props.history.push(`/${companyId}/home/vouchers/purchase/list`);
        }
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  // validate city field & state field on autoComplete
  validateAddressFields() {
    const { payload: { branchData: { city, state } } } = this.state;

    validate(this, 'city', city, 'registerCompanyValidations');
    validate(this, 'state', state, 'registerCompanyValidations');
  }

  handleContactChange(key, value) {
    if (key === 'industry') {
      let validateIndustry = true;
      validateIndustry &= validate(this, key, value, 'registerCompanyValidations');

      if (validateIndustry) {
        this.setState(updateCompanyData(key, value));
      }
    }
    this.setState(updateCompanyData(key, value));
  }

  handleBranchChange(key, value) {
    if (key === 'gstBusinessType') {
      let validateGSTBusinessType = true;
      validateGSTBusinessType &= validate(
        this,
        'gstBusinessType',
        value,
        'registerCompanyValidations'
      );

      if (validateGSTBusinessType) {
        this.setState(updateBranchData(key, value));
      }
    }
    this.setState(updateBranchData(key, value));
  }

  //this will be changed once ui gets updated
  handleBankdetailsChange(key, value) {
    this.setState(updateBankDetails(key, value));
  }

  initAutocomplete(postalCode) {
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

        this.setState(
          {
            payload: {
              ...this.state.payload,
              branchData: {
                ...this.state.payload.branchData,
                city: filteredData[1].short_name,
                state: filteredData[0].short_name
              }
            }
          },
          this.validateAddressFields
        );
      });
    }
  }

  companyDetails() {
    const {
      payload: {
        companyData: { name, industry, pancard },
        branchData: { gstBusinessType, gstin, address, city, state, pincode }
      }
    } = this.state;
    return (
      <div>
        <FormBlockTitle>Company Details</FormBlockTitle>

        <Fields>
          <FormRow>
            <Dropdown
              width="217px"
              labelSize="2%"
              value={industry}
              imgSrc={Industry}
              labelText="Industry"
              errorText={
                this.state.registerCompanyValidations.industry &&
                !this.state.registerCompanyValidations.industry.isValid
                  ? this.state.registerCompanyValidations.industry.message
                  : ''
              }
              onChange={value => this.handleContactChange('industry', value)}
            >
              <MenuItem value="Imitation Jewlery" primaryText="Imitation Jewlery" />
              <MenuItem value="Gold Jewlery" primaryText="Gold Jewlery" />
            </Dropdown>
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              value={name}
              hint="Invock"
              labelSize="2%"
              imgSrc={HandShake}
              labelText="Legal Business Name"
              onBlur={() => validate(this, 'name', name, 'registerCompanyValidations')}
              onChange={value => this.handleContactChange('name', value)}
              errorText={
                this.state.registerCompanyValidations.name &&
                !this.state.registerCompanyValidations.name.isValid
                  ? this.state.registerCompanyValidations.name.message
                  : ''
              }
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              value={address}
              labelSize="2%"
              imgSrc={Address}
              labelText="Shop no, Street name"
              hint="Work square, lower parel, mumbai"
              onBlur={() => validate(this, 'address', address, 'registerCompanyValidations')}
              onChange={value => this.handleBranchChange('address', value)}
              errorText={
                this.state.registerCompanyValidations.address &&
                !this.state.registerCompanyValidations.address.isValid
                  ? this.state.registerCompanyValidations.address.message
                  : ''
              }
            />
          </FormRow>

          <FormRow>
            <HorizontalFields>
              <TextInputField
                width="80px"
                hint="400014"
                labelSize="2%"
                value={pincode}
                id="autocomplete"
                imgSrc={Pincode}
                labelText="Pin Code"
                onChange={value => this.handleBranchChange('pincode', parseInt(value, 10) || '')}
                errorText={
                  this.state.registerCompanyValidations.pincode &&
                  !this.state.registerCompanyValidations.pincode.isValid
                    ? this.state.registerCompanyValidations.pincode.message
                    : ''
                }
                onBlur={() => {
                  let validatePinCode = true;
                  validatePinCode &= validate(
                    this,
                    'pincode',
                    pincode,
                    'registerCompanyValidations'
                  );

                  if (validatePinCode) {
                    this.initAutocomplete(pincode);
                  }
                }}
              />

              <TextInputField
                width="100px"
                value={city}
                hint="Mumbai"
                imgSrc={City}
                labelSize="2%"
                labelText="City"
                onBlur={() => validate(this, 'city', city, 'registerCompanyValidations')}
                onChange={value => this.handleBranchChange('city', value)}
                errorText={
                  this.state.registerCompanyValidations.city &&
                  !this.state.registerCompanyValidations.city.isValid
                    ? this.state.registerCompanyValidations.city.message
                    : ''
                }
              />

              <TextInputField
                hint="MH"
                width="65px"
                value={state}
                labelSize="2%"
                imgSrc={State}
                labelText="State"
                onBlur={() => validate(this, 'state', state, 'registerCompanyValidations')}
                onChange={value => this.handleBranchChange('state', value)}
                errorText={
                  this.state.registerCompanyValidations.state &&
                  !this.state.registerCompanyValidations.state.isValid
                    ? this.state.registerCompanyValidations.state.message
                    : ''
                }
              />
            </HorizontalFields>
          </FormRow>

          <FormRow>
            <Dropdown
              imgSrc={Gst}
              width="325px"
              labelSize="2%"
              hint="GST Business"
              value={gstBusinessType}
              labelText="GST Business"
              errorText={
                this.state.registerCompanyValidations.gstBusinessType &&
                !this.state.registerCompanyValidations.gstBusinessType.isValid
                  ? this.state.registerCompanyValidations.gstBusinessType.message
                  : ''
              }
              onChange={value => this.handleBranchChange('gstBusinessType', value)}
            >
              {map(this.state.businessTypes, (item, index) => (
                <MenuItem value={item.key} primaryText={item.value} key={index} />
              ))}
            </Dropdown>
          </FormRow>

          <FormRow>
            {gstBusinessType === 'unregistered' ? (
              <TextInputField
                width="325px"
                imgSrc={Gstin}
                labelSize="2%"
                value={pancard}
                hint="ABCDEF1234F"
                labelText="Pan-card Number"
                onChange={value => this.handleContactChange('pancard', value)}
              />
            ) : (
              <TextInputField
                width="325px"
                value={gstin}
                labelSize="2%"
                hint="GSTN ID"
                imgSrc={Gstin}
                labelText="GSTN ID"
                onChange={value => this.handleBranchChange('gstin', value)}
              />
            )}
          </FormRow>
        </Fields>

        <ButtonContainer>
          <Button
            to="#"
            replace
            margintop="0px"
            onClick={() => {
              if (this.validateCompanyDetails()) {
                this.setState({
                  renderCompanyDetails: false,
                  renderBankDetails: true
                });
              }
            }}
          >
            Next
          </Button>
        </ButtonContainer>
      </div>
    );
  }

  bankDetails() {
    const {
      payload: { bankAccount: { branch, ifscCode, bankName, accountName, accountNumber } }
    } = this.state;
    return (
      <div>
        <FormBlockTitle>Bank Details (optional)</FormBlockTitle>
        <Fields>
          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              value={accountName}
              hint="Account Holder Name"
              labelText="Account Name"
              imgSrc={CompanyPassword}
              onChange={value => this.handleBankdetailsChange('accountName', value)}
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              imgSrc={HandShake}
              value={accountNumber}
              hint="Bank Account Number"
              labelText="Account Number"
              onBlur={() =>
                validate(this, 'accountNumber', accountNumber, 'registerCompanyValidations')
              }
              onChange={value => this.handleBankdetailsChange('accountNumber', value)}
              errorText={
                this.state.registerCompanyValidations.accountNumber &&
                !this.state.registerCompanyValidations.accountNumber.isValid
                  ? this.state.registerCompanyValidations.accountNumber.message
                  : ''
              }
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              value={ifscCode}
              imgSrc={HandShake}
              labelText="IFSC Code"
              hint="Branch IFSC Code"
              onBlur={() => validate(this, 'ifscCode', ifscCode, 'registerCompanyValidations')}
              onChange={value => this.handleBankdetailsChange('ifscCode', value)}
              errorText={
                this.state.registerCompanyValidations.ifscCode &&
                !this.state.registerCompanyValidations.ifscCode.isValid
                  ? this.state.registerCompanyValidations.ifscCode.message
                  : ''
              }
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              value={bankName}
              hint="Bank Name"
              labelText="Bank Name"
              imgSrc={CompanyPassword}
              onChange={value => this.handleBankdetailsChange('bankName', value)}
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              value={branch}
              hint="Branch Name"
              labelText="Branch Name"
              imgSrc={CompanyPassword}
              onChange={value => this.handleBankdetailsChange('branch', value)}
            />
          </FormRow>
        </Fields>

        <ButtonContainer>
          <Button
            to="#"
            replace
            margintop="0px"
            onClick={() => {
              this.setState({
                renderCompanyDetails: false,
                renderBankDetails: false,
                renderPasswordDetails: true
              });
            }}
          >
            Next
          </Button>
        </ButtonContainer>
      </div>
    );
  }

  passwordDetails() {
    const { payload: { password }, confirmPassword } = this.state;

    return (
      <div>
        <FormBlockTitle>Password Details</FormBlockTitle>

        <Fields>
          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              type="password"
              value={password}
              hint="password-123"
              labelText="Password"
              imgSrc={CompanyPassword}
              onBlur={() => validate(this, 'password', password, 'registerCompanyValidations')}
              onChange={value =>
                this.setState({
                  payload: { ...this.state.payload, password: value }
                })
              }
              errorText={
                this.state.registerCompanyValidations.password &&
                !this.state.registerCompanyValidations.password.isValid
                  ? this.state.registerCompanyValidations.password.message
                  : ''
              }
            />
          </FormRow>

          <FormRow>
            <TextInputField
              width="325px"
              labelSize="2%"
              type="password"
              hint="password-123"
              value={confirmPassword}
              imgSrc={CompanyPassword}
              labelText="Re-enter Password"
              onBlur={() => {
                validate(this, 'confirmPassword', confirmPassword, 'registerCompanyValidations');

                if (this.state.confirmPassword !== this.state.payload.password) {
                  this.setState({
                    confirmError: 'Password did not match'
                  });
                } else if (this.state.confirmPassword === this.state.payload.password) {
                  this.setState({
                    confirmError: null
                  });
                }
              }}
              errorText={
                this.state.registerCompanyValidations.confirmPassword &&
                !this.state.registerCompanyValidations.confirmPassword.isValid
                  ? this.state.registerCompanyValidations.confirmPassword.message
                  : this.state.confirmError ? this.state.confirmError : ''
              }
              onChange={value => this.setState({ confirmPassword: value })}
            />
          </FormRow>
        </Fields>

        <ButtonContainer type="secondary">
          <Button
            to="#"
            replace
            margintop="0px"
            onClick={() => {
              // event tracking code
              mixpanel.track('register-company-button-click');
              ClevertapReact.event('register-company-button-click');

              if (
                this.validatePasswordFields() &&
                this.state.confirmPassword === this.state.payload.password
              ) {
                this.makePOSTRequest();
              }
            }}
          >
            Register
          </Button>
        </ButtonContainer>
      </div>
    );
  }

  render() {
    if (!this.state.businessTypes) {
      return (
        <ContentSection>
          <ContentContainer>
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          </ContentContainer>
        </ContentSection>
      );
    }

    if (this.state.accessToken === '') {
      return <Redirect to="/login" replace />;
    }

    return (
      <ContentSection>
        <ContentContainer>
          <PageHeader padding={!this.state.renderCompanyDetails ? 'true' : 'false'}>
            {!this.state.renderCompanyDetails && (
              <StyledImg
                width="15px"
                height="15px"
                src={BackArrow}
                onClick={() => {
                  if (this.state.renderBankDetails) {
                    this.setState({
                      renderBankDetails: false,
                      renderCompanyDetails: true
                    });
                  }
                  if (this.state.renderPasswordDetails) {
                    this.setState({
                      renderPasswordDetails: false,
                      renderBankDetails: true
                    });
                  }
                }}
              />
            )}{' '}
            Our team will do the verification check
          </PageHeader>

          {this.state.renderCompanyDetails && this.companyDetails()}
          {this.state.renderBankDetails && this.bankDetails()}
          {this.state.renderPasswordDetails && this.passwordDetails()}
        </ContentContainer>
      </ContentSection>
    );
  }
}

const mapStateToProps = ({ similarCompanyCheck, similarCompaniesData, user }) => ({
  user,
  similarCompanyCheck,
  similarCompaniesData
});

export default connect(mapStateToProps, {
  similarCompanies,
  registerCompanyPayload,
  toggleSimilarCompanyCheck
})(RegisterCompany);
