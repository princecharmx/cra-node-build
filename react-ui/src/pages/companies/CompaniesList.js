import React, { Component } from 'react';
import mixpanel from 'mixpanel-browser';
import ClevertapReact from 'clevertap-react';
import { connect } from 'react-redux';

import { fetchCompanies, selectCompany } from '../../actions/companies';
import {
  ContentSection,
  ContentContainer,
  CompanyName,
  StyledSpanContainer,
  StyledSpan,
  CompanyAddress,
  Content,
  StyledImg,
  Card,
  CardContainer,
  StyledLink,
  Description,
  List
} from '../../components/companies/CompaniesList';

import { RightArrow, Add, TapIcon } from '../../images';
import { Loader, LoaderContainer } from '../../components';

class CompaniesList extends Component {
  state = {
    render: {
      companiesList: true,
      passwordScreen: false
    },
    password: '',
    companyPasswordErrField: ''
  };

  componentDidMount() {
    // event tracking code
    mixpanel.track('company-list-screen');
    ClevertapReact.event('company-list-screen');

    this.props.fetchCompanies();
  }

  handleCompanyClick(company) {
    this.props.selectCompany(company.id);
  }

  renderCompany(company) {
    return (
      <Card
        type="company"
        key={company.id}
        onClick={() => {
          if (company.status === 'pending-join-approval') {
            this.props.history.push(
              `/${this.state.iUserID}/companies/request-access/${company.id}`
            );
          } else {
            this.handleCompanyClick(company);
          }
        }}
      >
        <CardContainer>
          <CompanyName>
            {company.name}
            {company.status !== '' && (
              <StyledSpanContainer>
                <StyledSpan>
                  {' '}
                  {company.status === 'pending-join-approval'
                    ? 'Request Pending'
                    : 'Request Apporved'}{' '}
                </StyledSpan>
              </StyledSpanContainer>
            )}
          </CompanyName>
          <CompanyAddress>
            {`${company.address}, ${company.city}, ${company.country}`}
          </CompanyAddress>
        </CardContainer>
        <StyledImg height="15px" width="15px" src={RightArrow} />
      </Card>
    );
  }

  renderCompaniesList() {
    return (
      <Content>
        <Card title="header">
          <CompanyName> Companies List </CompanyName>
          <StyledLink
            type="add"
            to="/companies/add"
            onClick={() => {
              ClevertapReact.event('goto-register-screen');
              mixpanel.track('goto-register-screen');
            }}
          >
            <StyledImg height="20px" width="20px" src={Add} />
          </StyledLink>
        </Card>
        {this.props.companies.length > 0 ? (
          <List>{this.props.companies.reverse().map(company => this.renderCompany(company))}</List>
        ) : (
          <List type="empty">
            <StyledImg type="empty" height="90px" width="90px" src={TapIcon} />
            <Description>
              No companies created yet. <br /> <br /> Click on the "+" icon to register a new
              company
            </Description>
          </List>
        )}
      </Content>
    );
  }

  render() {
    const { render: { companiesList, passwordScreen } } = this.state;
    const { companies } = this.props;

    return (
      <ContentSection>
        <ContentContainer>
          {/* render a loader while fetching the list of companies */}
          {!companies && (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          )}

          {/* render companies list screen */}
          {companiesList && !passwordScreen && companies && this.renderCompaniesList()}
        </ContentContainer>
      </ContentSection>
    );
  }
}

const mapStateToProps = ({ user, companies }) => ({ user, companies });

export default connect(mapStateToProps, { fetchCompanies, selectCompany })(CompaniesList);
