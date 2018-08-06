import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader } from 'material-ui/Card';
import { ListHeader } from '../ListHeader';

import { StatsContainer, StatBox } from '../../components';
import PartyStatement from '../../components/Contacts/PartyStatement';
import CardText from 'material-ui/Card/CardText';

const divStyle = {
  display: 'flex',
  paddingBottom: '1.875rem',
  justifyContent: 'space-between',
  marginLeft: '5px',
  marginfRight: '5px'
};

const flexDiv = {
  display: 'flex',
  justifyContent: 'space-between'
};

const MainContainer = props => {
  const { name, address, partyStatement, isStatementTab } = props;
  return (
    <React.Fragment>
      <div style={divStyle}>
        <ProfileCard name={name} address={address} />
        {/* <TabsContainer title={name} /> */}
      </div>
      <ListHeader
        type={'title'}
        title={isStatementTab ? 'Account Statement' : 'Vouchers Summary'}
      />
      {isStatementTab && partyStatement ? (
        <PartyStatement partyStatement={partyStatement} />
      ) : (
        <div />
      )}
    </React.Fragment>
  );
};

const ProfileCard = props => {
  return (
    <Card
      containerStyle={{ border: '1px solid rgb(112, 0, 0, 0.3)', 'box-shadow': 'rgb(0, 0, 0, 0)' }}
    >
      <CardHeader title={props.name} subtitle={props.address} />
      <CardText>{props.address}</CardText>
    </Card>
  );
};

const TabsContainer = () => (
  <div style={flexDiv}>
    <StatsContainer>
      <StatBox style={{ 'padding-left': '5px', 'margin-left': '15px' }}>Account Statement</StatBox>
    </StatsContainer>
    <StatsContainer>
      <StatBox>Vouchers Summary</StatBox>
    </StatsContainer>
  </div>
);

class Party extends Component {
  state = {
    loading: false,
    isStatementTab: true
  };

  render() {
    const { contact: { name, address }, partyStatement } = this.props;
    const { isStatementTab } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: '100%', 'overflow-y': 'scroll' }}>
          <MainContainer
            isStatementTab={isStatementTab}
            name={name}
            address={address}
            partyStatement={partyStatement}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { contacts: { partyStatement } } = state;
  return {
    partyStatement: partyStatement
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Party);
