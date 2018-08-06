import React, { Component } from 'react';
import { connect } from 'react-redux';

import ClevertapReact from 'clevertap-react';
import mixpanel from 'mixpanel-browser';

import { Header } from '../containers';
import {
  LoginPassword,
  SignInPhone,
  OTPPassword,
  OTPName,
  LoginPhone,
} from '../images';
import { phoneRegEx, onlyNumber, validateField, requiredField } from '../utils';
import { Button, Loader, TextInputField, LoaderContainer } from '../components';
import {
  ContentSection,
  Container,
  ContentContainer,
  Description,
  Content,
  StyledImg,
  OTPContainer,
  ResendOTP
} from '../components/Login';
import * as authActions from '../actions/auth';

class Login extends Component {
  state = {
    userName: '',
    password: '',
    signIn: false,
    loading: false,
    phoneNumber: '',
    otpErrField: '',
    nameField: false,
    nameErrField: '',
    phoneErrField: ''
  };

  componentDidMount() {
    mixpanel.track('sign-in-screen');
    ClevertapReact.event('sign-in-screen');
  }

  generateOtp = () => {
    this.props.generateOtp(this.state.phoneNumber);
  };

  /**
   * This function gets fired when the user clicks on the verify OPT button
   */
  verifyOTP = () => {
    const { userName: name, password: otpToken, phoneNumber: phone } = this.state;

    // clevertap profile tracking code
    const payload = {
      [this.state.phoneNumber]: {
        phone,
        name
      }
    };
    ClevertapReact.profile(payload);

    // mixpanel profile tracking code
    mixpanel.identify(this.state.phoneNumber);
    mixpanel.people.set({
      phone,
      name
    });
    this.props.verifyOtp(name, phone, otpToken);
  };

  handleResendOTPClick = () => {
    this.props.generateOtp(this.state.phoneNumber);
  };

  handleSignInClick = () => {
    mixpanel.track('sign-in-button-click');
    ClevertapReact.event('sign-in-button-click');

    const phoneValidation = validateField(
      this.state.phoneNumber,
      phoneRegEx,
      'Please enter a valid phone number'
    );

    if (this.state.phoneNumber === '') {
      this.setState({
        phoneErrField: 'Please enter a number'
      });
    }

    if (phoneValidation !== '') {
      this.setState({
        phoneErrField: phoneValidation
      });
    }

    if (this.state.phoneNumber !== '' && phoneValidation === '') {
      this.generateOtp();
    }
  };

  handleVerifyOTPClick = () => {
    mixpanel.track('sign-in-verify-button-click');
    ClevertapReact.event('sign-in-verify-button-click');

    const OTPValidation = validateField(
      this.state.password,
      onlyNumber,
      'Please enter a valid OTP'
    );

    const NameValidation = validateField(this.state.userName, requiredField, 'Please enter a name');

    if (this.state.password === '') {
      this.setState(
        {
          otpErrField: 'Please enter a number'
        },
        () => {}
      );
    }

    if (OTPValidation !== '') {
      this.setState(
        {
          otpErrField: OTPValidation
        },
        () => {}
      );
    }

    if (NameValidation !== '') {
      this.setState(
        {
          nameErrField: NameValidation
        },
        () => {}
      );
    }

    if (this.state.password !== '' && OTPValidation === '') {
      this.verifyOTP();
    }
  };

  validateOnBlur = (value, errField, errMsg) => {
    if (!value) {
      this.setState({
        [errField]: errMsg
      });
    } else {
      this.setState({
        [errField]: ''
      });
    }
  };

  renderSignIn() {
    return (
      <Content>
        <StyledImg height="200px" width="200px" src={LoginPhone} />
        <Description>
          Take your <br /> business to next level!
        </Description>

        <TextInputField
          type="text"
          width="200px"
          labelSize="2%"
          autoFocus="true"
          iconHeight="20px"
          iconWeight="20px"
          hint="9876543210"
          imgSrc={SignInPhone}
          labelText="Phone Number"
          errorText={this.state.phoneErrField}
          value={this.state.phoneNumber || ''}
          onKeyUp={e => e.key === 'Enter' && this.handleSignInClick()}
          onChange={value => this.setState({ phoneNumber: parseInt(value, 10) })}
          onBlur={() =>
            this.validateOnBlur(
              this.state.phoneNumber,
              'phoneErrField',
              'Please enter a mobile number'
            )
          }
        />

        <Button to="#" replace onClick={() => this.handleSignInClick()}>
          Sign In
        </Button>
      </Content>
    );
  }
  sendOtpOnScreen = () => {
    this.props.generateOtp(this.state.phoneNumber, true);
  };
  renderOTPScreen() {
    const { userName: name, password: otpToken, phoneNumber: phone } = this.state;
    const { user: { nameField } } = this.props;
    mixpanel.track('sign-in-verify-screen');
    ClevertapReact.event('sign-in-verify-screen');

    return (
      <Content>
        <StyledImg
          height="200px"
          width="200px"
          src={LoginPassword}
          /*this is only for beta phase, will be removed after release*/
          onClick={this.sendOtpOnScreen}
        />
        <Description>
          You should recieve One Time Password <br /> (OTP) to{' '}
          {`${phone.toString().substring(0, 2)}******${phone.toString().slice(-2)}`} within a
          minute.
        </Description>

        {nameField && (
          <TextInputField
            type="text"
            value={name}
            width="200px"
            labelSize="2%"
            labelText="Name"
            autoFocus="true"
            imgSrc={OTPName}
            iconHeight="20px"
            iconWeight="20px"
            hint="Andrew Clark"
            errorText={this.state.nameErrField}
            onChange={value => this.setState({ userName: value })}
            onBlur={() => this.validateOnBlur(name, 'nameErrField', 'Please enter a name')}
          />
        )}

        <OTPContainer>
          <TextInputField
            hint="123456"
            width="200px"
            labelSize="2%"
            labelText="OTP"
            type="password"
            autoFocus="true"
            value={otpToken}
            iconHeight="20px"
            iconWeight="20px"
            imgSrc={OTPPassword}
            errorText={this.state.otpErrField}
            onChange={value => this.setState({ password: value })}
            onKeyUp={e => e.key === 'Enter' && this.handleVerifyOTPClick()}
            onBlur={() => this.validateOnBlur(otpToken, 'otpErrField', 'Please enter the OTP')}
          />

          <ResendOTP onClick={() => this.handleResendOTPClick()}>Resend OTP</ResendOTP>
        </OTPContainer>

        <Button to="#" replace onClick={this.handleVerifyOTPClick}>
          Verify OTP
        </Button>
      </Content>
    );
  }

  render() {
    const { user: { loadingGenerateOtp: loading, signIn } } = this.props;
    return (
      <Container>
        <Header />

        <ContentSection>
          <ContentContainer>
            {/* Render the phoneNumber screen by default */}
            {!loading && !signIn && this.renderSignIn()}

            {/* Show a loader while getting the API response for the first API call */}
            {loading && (
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            )}

            {/* Render the OTP screen once after the user requests for the OTP */}
            {!loading && signIn && this.renderOTPScreen()}
          </ContentContainer>
        </ContentSection>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps, authActions)(Login);
