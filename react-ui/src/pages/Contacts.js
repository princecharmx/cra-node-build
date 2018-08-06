import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Add, PhoneLogo } from '../images';
import { ListHeader } from '../containers';
import { ImageHolder } from '../components';
import LazyImport from '../utils/lazyImport';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import {
  Container,
  ListContainer,
  SelectedItemContainer,
  ContactTitle,
  ButtonExtended,
  StyledSpan
} from '../components/Contacts';

import { fetchContacts, drawerOpenAddContact, fetchPartyStatement } from '../actions/contacts';
import { List, ListItem, Divider } from 'material-ui';
import { getStartOfFinancialYear, getEndOfFinancialYear } from '../utils';

const AddContact = LazyImport(() => import('../containers/AddContact'));
const PartyContainer = LazyImport(() => import('../containers/parties/Party'));

class Contacts extends Component {
  state = {
    loading: false,
    selectedContact: null,
    openAddContact: false,
    contactListData: null,
    resetToDefaultState: false
  };

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = () => {
    this.props.fetchContacts(this.props.company.id);
  };

  onMouseOver() {
    AddContact.preload();
  }

  setSelectedContact(companyId, contact) {
    const storeKey = 'partyStatement';
    const startDate = getStartOfFinancialYear(new Date());
    const endDate = getEndOfFinancialYear(new Date());
    this.props.fetchPartyStatement(companyId, contact.id, startDate, endDate, storeKey);
    this.setState({
      selectedContact: contact
    });
  }

  render() {
    const { contacts, match, company } = this.props;
    return (
      <Container>
        <ListContainer>
          <ListHeader
            icon={Add}
            headerRight
            type="title"
            to="#"
            replace
            // onMouseOver={() => this.onMouseOver()}
            title="Parties"
            onClick={this.props.drawerOpenAddContact}
          />
          {contacts !== null &&
            !isEmpty(contacts) && (
              <List>
                {map(contacts, (contact, index) => (
                  <Link
                    replace
                    onClick={() => this.setSelectedContact(company.id, contact)}
                    to={`/${company.id}/home/${match.params.page}/${contact.id}/list`}
                    style={{ textDecoration: 'none' }}
                    key={`contactsLink--${index}`}
                  >
                    <ListItem
                      primaryText={contact.name}
                      secondaryText={`${contact.address}, ${contact.city}, ${contact.state}`}
                    />
                    <Divider />
                  </Link>
                )).reverse()}
              </List>
            )}
        </ListContainer>

        {this.state.selectedContact !== null ? (
          <SelectedItemContainer>
            <PartyContainer contact={this.state.selectedContact} />
          </SelectedItemContainer>
        ) : (
          <SelectedItemContainer type="empty">
            <ImageHolder height="150px" width="100px" src={PhoneLogo} type="empty" />
            <ContactTitle type="empty">
              Download Invock app and automatically <br /> sync vouchers with web
            </ContactTitle>
            <ButtonExtended
              type="empty"
              to="#"
              replace
              onClick={() => window.open('https://play.google.com/store')}
            >
              Download App
            </ButtonExtended>
            <ContactTitle type="empty">
              or <br /> <br />{' '}
              <StyledSpan onClick={this.props.drawerOpenAddContact}>
                click here to add a contact
              </StyledSpan>
            </ContactTitle>
          </SelectedItemContainer>
        )}

        <AddContact
          getContact={this.fetchContacts}
          resetToDefaultState={this.state.resetToDefaultState}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ currentCompany, contacts }) => ({
  company: currentCompany,
  contacts: contacts.contactList
});

export default connect(mapStateToProps, {
  fetchContacts,
  drawerOpenAddContact,
  fetchPartyStatement
})(Contacts);
