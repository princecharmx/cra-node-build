import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Avatar, IconButton } from 'material-ui';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import { fetchCompanyBranch } from '../actions';
import LazyImport from '../utils/lazyImport';
import { Menu, resetAllBlack } from '../images';
import { removeLocalStorage } from '../utils';
import {
  HeaderItems,
  ListContainer,
  ListAnchror,
  Container,
  ContentSection,
  StyledImg,
  StyledSpan
} from '../components/Dashboard';

const styles = {
  header: {
    width: '100%',
    borderRadius: '0px',
    paddingLeft: '30px',
    paddingRight: '30px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 1px 10px 0px rgba(0,0,0,0.35)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  avatar: {
    color: '#ffffff',
    userSelect: 'none',
    backgroundColor: 'rgb(255, 204, 128)',
    position: 'relative',
    left: '400px'
  }
};

const Reports = LazyImport(() => import('./Reports'));
const Contacts = LazyImport(() => import('./Contacts'));
const Items = LazyImport(() => import('./Items'));
const Vouchers = LazyImport(() => import('./Vouchers'));

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchCompanyBranch();
  }
  renderNavItems() {
    const { company, match } = this.props;
    const routes = ['vouchers', 'parties', 'reports', 'items'];
    return (
      <ListContainer>
        {routes.map(route => {
          return (
            <Link key={`route-${route}`} to={`/${company.id}/home/${route}`}>
              <ListAnchror active={match.params.page === route}>{upperFirst(route)}</ListAnchror>
            </Link>
          );
        })}
      </ListContainer>
    );
  }

  getName() {
    const { user } = this.props;
    return user.name;
  }

  render() {
    const { match } = this.props;
    return (
      <Container>
        <AppBar
          title=""
          style={styles.header}
          iconElementLeft={
            <IconButton>
              <StyledImg src={Menu} width="20px" height="20px" />
            </IconButton>
          }
        >
          <HeaderItems>
            {this.renderNavItems()}
            <StyledSpan>
              <Avatar style={styles.avatar}>{this.getName()}</Avatar>
              <StyledSpan style={{ position: 'relative', left: '400px' }} paddingLeft="10px">
                {this.getName()}
              </StyledSpan>
            </StyledSpan>
            <span onClick={() => removeLocalStorage()}>
              <img alt="Reset" src={resetAllBlack} height="16px" />
            </span>
          </HeaderItems>
        </AppBar>

        <ContentSection padding={'5px 30px 0px 30px'}>
          {/* render Contacts Screen */}

          {match.params.page === 'reports' && <Reports {...this.props} />}

          {/* render Contacts Screen */}
          {match.params.page === 'parties' && <Contacts {...this.props} />}

          {/* render Vouchers Screen */}
          {match.params.page === 'vouchers' && <Vouchers {...this.props} />}

          {/* render items Screen */}
          {match.params.page === 'items' && <Items {...this.props} />}
        </ContentSection>
      </Container>
    );
  }
}

const mapStateToProps = ({ currentCompany, user }) => ({
  company: currentCompany,
  user
});
export default connect(mapStateToProps, { fetchCompanyBranch })(Dashboard);
