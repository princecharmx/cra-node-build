import cookie from 'react-cookies';
import styled from 'styled-components';
import React, { Component } from 'react';
import Redirect from 'react-router-dom/Redirect';

import * as CONSTANTS from '../../constants';
import { AdminIcon } from '../../images';

const Container = styled.div`
  height: 80vh;
  width: 400px;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

const Screen = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
`;

const StyledImg = styled.img`
  background-color: transparent;
  width: ${props => (props.width ? props.width : '15px')};
  height: ${props => (props.height ? props.height : '15px')};
`;

const Description = styled.div`
  width: 100%;
  color: #b2adad;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  padding: 30px 0px 0px 0px;
`;

class AdminAccess extends Component {
  state = {
    companyName: cookie.load('tempCompanyName')
  };

  render() {
    const userId = cookie.load(CONSTANTS.I_USER_ID);

    if (!userId) {
      return <Redirect to="/login" />;
    } else {
      return (
        <Container>
          <Screen>
            <StyledImg height="100px" width="100px" src={AdminIcon} />

            <Description>
              Access request has been sent to the admin. <br /> Once the admin approves you will be{' '}
              <br /> able to join {this.state.companyName} company.
            </Description>
          </Screen>
        </Container>
      );
    }
  }
}

export default AdminAccess;
