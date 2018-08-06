import map from 'lodash/map';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { Component } from 'react';
import { FlatButton } from 'material-ui';
import { Redirect } from 'react-router-dom';

import * as companiesApi from '../../api/companies';

import { Popup } from '../../components';
import { SimilarCompanyAdd } from '../../images';
import * as CONSTANTS from '../../constants';

import { similarCompanies, registerCompanyPayload, toggleSimilarCompanyCheck } from '../../actions';

const Container = styled.div`
  height: 80vh;
  width: 400px;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

const Content = styled.div`
  display: flex;
  width: calc(100%);
  padding: 20px 0px 0px;
  flex-direction: column;
  align-items: flex-start;
  height: calc(100% - 20px);
  justify-content: flex-start;
`;

const PageHeader = styled.div`
  width: 100%;
  color: #888888;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  margin-bottom: 30px;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-shrink: 0;
  overflow-y: scroll;
  flex-direction: column;
  height: calc(100% - 50px);
  justify-content: flex-start;
`;

const Card = styled.div`
  display: flex;
  flex-shrink: 0;
  padding: 10px 20px;
  flex-direction: column;
  width: calc(100% - 40px);
  border-bottom: 1px solid #c5c5c5;
  cursor: ${p => (p.action === 'register' ? 'pointer' : 'default')};
  align-items: ${p => (p.action === 'register' ? 'center' : 'flex-start')};
  justify-content: ${p => (p.action === 'register' ? 'center' : 'space-between')};
`;

const CardTitle = styled.div`
  width: 100%;
  display: flex;
  aling-items: center;
  justify-content: space-between;
`;

const Text = styled.div`
  line-height: 25px;
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontsize ? p.fontsize : '14px')};
  font-weight: ${p => (p.fontweight ? p.fontweight : '400')};
  text-align: ${p => (p.action === 'register' ? 'center' : 'start')};
  ${p =>
    p.textFormat === 'underline' &&
    `
    text-decoration: underline;
  `} ${p =>
      p.type === 'address' &&
      `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `};
`;

const StyledImg = styled.img`
  cursor: pointer;
  width: ${p => (p.width ? p.width : '20px')};
  height: ${p => (p.height ? p.height : '20px')};
`;

class SimilarCompanies extends Component {
  state = {
    userAccessToken: cookie.load('userAccessToken'),
    userId: cookie.load(CONSTANTS.I_USER_ID),
    showConfirmDialog: false,
    selectedCompanyName: '',
    selectedCompanyId: ''
  };

  handleRegisterCompany() {
    companiesApi
      .createCompany(this.state.userId, {
        ...this.props.registerCompanyData,
        skipSimilarCompanyCheck: true
      })
      .then(response => response.data)
      .then(data => {
        const companyId = data.createdCompany && data.createdCompany.id;

        cookie.save(CONSTANTS.COMPANY_ID, companyId, { path: '/' });
        /**
         * everytime the user tries to login into a new company we will store the
         * company specific accesstoken in 'userId@companyId' format so that the
         * accessToken will be unique everytime
         *
         * this.state.userId ➡ userId
         * data.createdCompany.id ➡ comanyId
         */
        data.accessToken &&
          cookie.save(`${data.accessToken.iUserId}@${companyId}`, data.accessToken.id, {
            path: '/'
          });
        this.props.history.replace(`/${companyId}/home/contacts`);

        // resetting the data for similar companies & removing the payload for add company from redux store
        this.props.similarCompanies(null);
        this.props.registerCompanyPayload(null);
        this.props.toggleSimilarCompanyCheck(false);
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  handleRequestAccess() {
    this.setState({
      showConfirmDialog: false
    });

    companiesApi
      .requestCompanyAccess(this.state.userId, this.state.selectedCompanyId)
      .then(data => {
        this.props.history.replace(`/${this.props.match.params.id}/companies/list`);

        // restore defaults for similarCompaniesData, saved register company, companyCheck toggle
        this.props.similarCompanies(null);
        this.props.registerCompanyPayload(null);
        this.props.toggleSimilarCompanyCheck(false);
      })
      .catch(error => {
        alert(
          error.response && error.response.data && error.response.data !== null
            ? error.response.data.error.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  render() {
    if (this.state.userAccessToken === '') {
      return <Redirect to={`/login`} replace />;
    }

    if (!this.props.registerCompanyData || !this.props.similarCompaniesData) {
      return <Redirect to={`/${this.props.match.params.id}/companies/add`} replace />;
    }

    const { registerCompanyData, similarCompaniesData } = this.props;

    const popupActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        labelStyle={{ color: '#868686' }}
        onClick={() => this.setState({ showConfirmDialog: false })}
      />,
      <FlatButton
        primary={true}
        label="Confirm"
        labelStyle={{ color: '#13685f' }}
        onClick={() => this.handleRequestAccess()}
      />
    ];

    return (
      <Container>
        <Content>
          <PageHeader>We have found similar companies in our records</PageHeader>

          <List>
            {similarCompaniesData.length > 0 &&
              map(similarCompaniesData, similarCompany => (
                <Card key={similarCompany.id}>
                  <CardTitle>
                    <Text
                      color="#888888"
                      fontsize="16px"
                      textFormat={
                        similarCompany.name === registerCompanyData.companyData.name
                          ? 'underline'
                          : 'default'
                      }
                    >
                      {similarCompany.name}
                    </Text>

                    <StyledImg
                      src={SimilarCompanyAdd}
                      width="20px"
                      height="20px"
                      onClick={() => {
                        this.setState({
                          showConfirmDialog: true,
                          selectedCompanyId: similarCompany.id,
                          selectedCompanyName: similarCompany.name
                        });
                      }}
                    />
                  </CardTitle>

                  {similarCompany.pancard &&
                    similarCompany.pancard !== '' && (
                      <Text
                        color="#888888"
                        textFormat={
                          similarCompany.pancard === registerCompanyData.companyData.pancard
                            ? 'underline'
                            : 'default'
                        }
                      >
                        Pan Card: {similarCompany.pancard}
                      </Text>
                    )}

                  {similarCompany.gstin &&
                    similarCompany.gstin !== '' && (
                      <Text
                        color="#888888"
                        textFormat={
                          similarCompany.gstin === registerCompanyData.companyData.gstin
                            ? 'underline'
                            : 'default'
                        }
                      >
                        GSTIN: {similarCompany.gstin}
                      </Text>
                    )}

                  <Text
                    type="address"
                    color="#888888"
                    textFormat={
                      similarCompany.address === registerCompanyData.companyData.address
                        ? 'underline'
                        : 'default'
                    }
                  >
                    {similarCompany.address}
                  </Text>
                </Card>
              ))}

            <Card action="register" onClick={() => this.handleRegisterCompany()}>
              <Text action="register" color="#bababa">
                None of the above is my company
              </Text>
            </Card>
          </List>
        </Content>

        {/* renders request company access dialog */}
        <Popup
          popupWidth="280px"
          popupButtons={popupActions}
          openPopup={this.state.showConfirmDialog}
        >
          <Text fontsize="16px">
            You sure you wanna join <strong>{this.state.selectedCompanyName}</strong>
          </Text>
        </Popup>
      </Container>
    );
  }
}

const mapStateToProps = ({ registerCompanyData, similarCompaniesData }) => ({
  registerCompanyData,
  similarCompaniesData
});

export default connect(mapStateToProps, {
  similarCompanies,
  registerCompanyPayload,
  toggleSimilarCompanyCheck
})(SimilarCompanies);
