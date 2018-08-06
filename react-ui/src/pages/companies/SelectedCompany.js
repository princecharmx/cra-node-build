import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  ContentContainer,
  PasswordScreen,
  StyledImg,
  Description
} from '../../components/companies/SelectedCompany';

import { authCompany } from '../../actions/companies';

import { Button, TextInputField } from '../../components';
import { CompanyPasswordLogo, PasswordLogo } from '../../images';
import { removeLocalStorage } from '../../utils';

class SelectedCompany extends Component {
  state = {
    password: null
  };

  handleConfirmCompanyPassword = () => {
    const { password } = this.state;
    if (!isEmpty(password)) {
      this.props.authCompany(password);
    } else {
      this.setState({
        companyPasswordErrField: 'Please enter a valid password'
      });
    }
  };

  render() {
    const { company } = this.props;
    if (company == null || company.id == null) {
      removeLocalStorage();
      return;
    }
    return (
      <ContentContainer>
        <PasswordScreen>
          <StyledImg height="200px" width="200px" src={CompanyPasswordLogo} />

          <Description>
            Enter your password to access <br />
            {company.name} company
          </Description>

          <TextInputField
            width="300px"
            labelSize="2%"
            type="password"
            imgSrc={PasswordLogo}
            value={this.state.password}
            labelText="Company password"
            errorText={this.state.companyPasswordErrField}
            onChange={value => this.setState({ password: value })}
            onKeyUp={e => e.key === 'Enter' && this.handleConfirmCompanyPassword()}
          />

          <Button to="#" replace onClick={this.handleConfirmCompanyPassword}>
            Login
          </Button>
        </PasswordScreen>
      </ContentContainer>
    );
  }
}

const mapStateToProps = ({ currentCompany, user }) => ({
  company: currentCompany,
  user
});

export default connect(mapStateToProps, { authCompany })(SelectedCompany);
